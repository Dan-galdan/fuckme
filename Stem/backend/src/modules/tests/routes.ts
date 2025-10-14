import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { Test, Question, TestAttempt, LevelScore, User, PlacementSession } from '../../db/models/index.js';
import { computeLevel, calculateTopicMastery } from '../tests/placementLogic.js';
import { computeRecommendations, saveRecommendations } from '../recommendations/service.js';
import { verifyAccessToken } from '../../utils/auth.js';

export default async function testRoutes(fastify: FastifyInstance) {
  // Get placement test
  fastify.get('/placement', async (request, reply) => {
    const query = request.query as any;
    const grade = query.grade || '6';
    
    // Find placement test for the grade
    let placementTest = await Test.findOne({
      type: 'placement',
      gradeRange: { $in: [grade] },
      isActive: true
    }).populate('questionRefs.questionId');
    
    if (!placementTest) {
      // Create a basic placement test if none exists
      const questions = await Question.find({
        topics: { $in: getGradeTopics(grade) },
        difficulty: { $gte: 1, $lte: 5 }
      }).limit(20);
      
      if (questions.length === 0) {
        return reply.status(404).send({
          error: 'No questions available',
          message: 'No questions found for placement test'
        });
      }
      
      placementTest = new Test({
        type: 'placement',
        title: `Placement Test - Grade ${grade}`,
        description: 'Determine your current level',
        gradeRange: [grade],
        topics: getGradeTopics(grade),
        questionRefs: questions.map(q => ({
          questionId: q._id,
          weight: 1,
          difficulty: q.difficulty
        })),
        isActive: true
      });
      
      await placementTest.save();
      await placementTest.populate('questionRefs.questionId');
    }
    
    // Return test without answers
    const testData = {
      id: (placementTest._id as any).toString(),
      title: placementTest.title,
      description: placementTest.description,
      timeLimitSec: placementTest.timeLimitSec,
      questions: placementTest.questionRefs.map((ref: any) => ({
        id: ref.questionId._id.toString(),
        stem: ref.questionId.stem,
        kind: ref.questionId.kind,
        options: ref.questionId.options?.map((opt: any) => ({
          id: opt.id,
          text: opt.text
        })) || [],
        difficulty: ref.questionId.difficulty,
        topics: ref.questionId.topics
      }))
    };
    
    return testData;
  });
  
  // Submit test attempt
  fastify.post('/attempt', {
    schema: {
      body: {
        type: 'object',
        properties: {
          testId: { type: 'string' },
          placementSessionId: { type: 'string' },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                questionId: { type: 'string' },
                answer: {}
              },
              required: ['questionId', 'answer']
            }
          }
        },
        required: ['testId', 'answers']
      }
    }
  }, async (request, reply) => {
    const { testId, placementSessionId, answers } = request.body as any;
    
    // Check if this is a logged-in user taking a retest
    const token = request.cookies.accessToken;
    let user = null;
    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) {
        user = await User.findById(payload.userId);
      }
    }
    
    // Get test and questions
    const test = await Test.findById(testId).populate('questionRefs.questionId');
    if (!test) {
      return reply.status(404).send({
        error: 'Test not found',
        message: 'The specified test does not exist'
      });
    }
    
    // Process answers and calculate scores
    const attemptItems = [];
    let totalScore = 0;
    const topicStats: Record<string, { correct: number; total: number }> = {};
    
    for (const answer of answers) {
      const questionRef = test.questionRefs.find((ref: any) => 
        ref.questionId._id.toString() === answer.questionId
      );
      
      if (!questionRef) continue;
      
      const question = questionRef.questionId as any;
      const isCorrect = checkAnswer(question, answer.answer);
      const score = isCorrect ? questionRef.weight : 0;
      
      attemptItems.push({
        questionId: question._id,
        answer: answer.answer,
        correct: isCorrect,
        score,
        topicTags: question.topics
      });
      
      totalScore += score;
      
      // Update topic statistics
      for (const topic of question.topics) {
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0 };
        }
        topicStats[topic].total++;
        if (isCorrect) {
          topicStats[topic].correct++;
        }
      }
    }
    
    const scorePercent = (totalScore / test.questionRefs.length) * 100;
    const weakTopics = Object.keys(topicStats).filter(topic => 
      topicStats[topic].correct / topicStats[topic].total < 0.5
    );
    
    // Handle placement test completion for both new registrations and existing users
    if (placementSessionId) {
      // New user registration flow
      console.log(`Looking for placement session: ${placementSessionId}`);
      const sessionData = await PlacementSession.findOne({ sessionId: placementSessionId });
      if (!sessionData) {
        console.log(`Placement session not found: ${placementSessionId}`);
        return reply.status(400).send({
          error: 'Placement session not found',
          message: 'Placement session not found or expired. Please restart the registration process.'
        });
      }
      console.log(`Placement session found: ${placementSessionId} for ${sessionData.email}`);
      
      // Store the level estimate and topics profile in the session
      const levelEstimate = computeLevel(scorePercent, sessionData.grade);
      
      await PlacementSession.updateOne(
        { sessionId: placementSessionId },
        {
          levelEstimate,
          topicsProfile: calculateTopicMastery(topicStats)
        }
      );
    } else if (user) {
      // Existing user retest flow
      console.log(`Existing user retest: ${user.email}`);
      
      // Create LevelScore record for the retest
      const levelEstimate = computeLevel(scorePercent, user.grade);
      const levelScore = new LevelScore({
        userId: user._id,
        source: 'retest',
        level: levelEstimate,
        scorePercent: scorePercent,
        topicsProfile: calculateTopicMastery(topicStats),
        weakTopics: Object.keys(topicStats).filter(topic => 
          topicStats[topic].correct / topicStats[topic].total < 0.5
        )
      });
      
      await levelScore.save();
      
      // Generate new recommendations based on retest results
      try {
        const lessonIds = await computeRecommendations((user._id as any).toString());
        const rationale = `Updated recommendations based on retest results. Level: ${levelEstimate}, Weak topics: ${Object.keys(topicStats).filter(topic => topicStats[topic].correct / topicStats[topic].total < 0.5).join(', ')}`;
        
        if (lessonIds.length > 0) {
          await saveRecommendations((user._id as any).toString(), lessonIds, rationale);
        }
      } catch (error) {
        console.error('Error generating recommendations:', error);
      }
    } else {
      return reply.status(401).send({
        error: 'Authentication required',
        message: 'You must be logged in to take a placement test, or provide a valid placement session ID.'
      });
    }
    
    // Create test attempt record
    const attempt = new TestAttempt({
      ...(user ? { userId: user._id } : {}), // Set userId for existing users
      testId: test._id,
      startedAt: new Date(),
      submittedAt: new Date(),
      items: attemptItems,
      totalScore: scorePercent,
      levelEstimate: placementSessionId ? computeLevel(scorePercent, '6') : (user ? computeLevel(scorePercent, user.grade) : undefined),
      summaryWeakTopics: weakTopics
    });
    
    await attempt.save();
    
    const response: any = {
      attemptId: (attempt._id as any).toString(),
      totalScore: scorePercent,
      levelEstimate: placementSessionId ? computeLevel(scorePercent, '6') : (user ? computeLevel(scorePercent, user.grade) : undefined),
      weakTopics,
      message: 'Test submitted successfully'
    };

    // If this is a placement test, include the session data in the response
    if (placementSessionId) {
      const sessionData = await PlacementSession.findOne({ sessionId: placementSessionId });
      if (sessionData) {
        response.topicsProfile = sessionData.topicsProfile;
        response.levelEstimate = sessionData.levelEstimate;
      }
    } else if (user) {
      // For existing users, include their updated level information
      response.topicsProfile = calculateTopicMastery(topicStats);
      response.levelEstimate = computeLevel(scorePercent, user.grade);
      response.user = {
        _id: user._id,
        email: user.email,
        name: user.name,
        grade: user.grade,
        currentLevel: computeLevel(scorePercent, user.grade)
      };
    }

    return response;
  });
  
  // Get retest schedule
  fastify.get('/retest/schedule', async (request, reply) => {
    const token = request.cookies.accessToken;
    
    // Debug logging
    fastify.log.info({
      cookies: request.cookies,
      hasToken: !!token,
      tokenLength: token?.length
    }, 'Retest schedule request');
    
    if (!token) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    const payload = verifyAccessToken(token);
    if (!payload) {
      return reply.status(401).send({
        error: 'Invalid token',
        message: 'Authentication token is invalid'
      });
    }
    
    const user = await User.findById(payload.userId);
    if (!user) {
      return reply.status(404).send({
        error: 'User not found',
        message: 'User does not exist'
      });
    }
    
    // Check if user is eligible for retest
    const lastLevelScore = await LevelScore.findOne({ userId: user._id })
      .sort({ createdAt: -1 });
    
    const completedLessons = 0; // TODO: Count completed lessons
    
    const isEligible = !lastLevelScore || 
      (Date.now() - lastLevelScore.createdAt.getTime()) > (14 * 24 * 60 * 60 * 1000) ||
      completedLessons >= 8;
    
    return {
      isEligible,
      lastTestDate: lastLevelScore?.createdAt,
      completedLessons,
      nextEligibleDate: lastLevelScore ? 
        new Date(lastLevelScore.createdAt.getTime() + (14 * 24 * 60 * 60 * 1000)) : 
        new Date()
    };
  });
}

function checkAnswer(question: any, answer: any): boolean {
  // Handle null/undefined answers
  if (answer === null || answer === undefined) {
    return false;
  }

  switch (question.kind) {
    case 'mcq':
      const correctOption = question.options?.find((opt: any) => opt.isCorrect);
      return correctOption?.id === String(answer);
    
    case 'numeric':
      const tolerance = 0.01;
      const numericAnswer = Number(answer);
      const numericKey = Number(question.answerKey);
      return !isNaN(numericAnswer) && !isNaN(numericKey) && 
             Math.abs(numericAnswer - numericKey) <= tolerance;
    
    case 'short_text':
      if (question.answerKey instanceof RegExp) {
        return question.answerKey.test(String(answer).toLowerCase());
      }
      return String(answer).toLowerCase() === String(question.answerKey).toLowerCase();
    
    default:
      return false;
  }
}

function getGradeTopics(grade: string): string[] {
  const topicMap: Record<string, string[]> = {
    '6': ['kinematics', 'forces', 'energy', 'matter'],
    '7': ['kinematics', 'forces', 'energy', 'waves', 'electricity'],
    '8': ['kinematics', 'forces', 'energy', 'waves', 'electricity', 'magnetism'],
    '9': ['kinematics', 'forces', 'energy', 'waves', 'electricity', 'magnetism', 'optics'],
    '10': ['kinematics', 'forces', 'energy', 'waves', 'electricity', 'magnetism', 'optics', 'thermodynamics'],
    '11': ['kinematics', 'forces', 'energy', 'waves', 'electricity', 'magnetism', 'optics', 'thermodynamics', 'quantum'],
    '12': ['kinematics', 'forces', 'energy', 'waves', 'electricity', 'magnetism', 'optics', 'thermodynamics', 'quantum', 'relativity'],
    'EESH': ['kinematics', 'forces', 'energy', 'waves', 'electricity', 'magnetism', 'optics', 'thermodynamics', 'quantum', 'relativity']
  };
  
  return topicMap[grade] || topicMap['6'];
}
