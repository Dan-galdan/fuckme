import { FastifyInstance } from 'fastify';
import { Lesson, Question, Test, User, TestAttempt, LevelScore } from '../../db/models/index.js';
import { verifyAccessToken } from '../../utils/auth.js';

export default async function adminRoutes(fastify: FastifyInstance) {
  // Admin middleware
  fastify.addHook('preHandler', async (request, reply) => {
    const token = request.cookies.accessToken;
    if (!token) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const payload = verifyAccessToken(token);
    if (!payload || !payload.roles.includes('admin')) {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }
  });

  // Create lesson
  fastify.post('/lessons', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          slug: { type: 'string' },
          grade: { type: 'string' },
          topics: { type: 'array', items: { type: 'string' } },
          difficulty: { type: 'number', minimum: 1, maximum: 5 },
          type: { type: 'string', enum: ['video', 'reading', 'exercise'] },
          contentUrl: { type: 'string' },
          contentUrls: { type: 'array', items: { type: 'string' } },
          isPublished: { type: 'boolean' }
        },
        required: ['title', 'slug', 'grade', 'topics', 'difficulty', 'type']
      }
    }
  }, async (request, reply) => {
    const lessonData = request.body as any;

    const lesson = new Lesson(lessonData);
    await lesson.save();

    return {
      id: (lesson._id as any).toString(),
      message: 'Lesson created successfully'
    };
  });

  // Create question
  fastify.post('/questions', {
    schema: {
      body: {
        type: 'object',
        properties: {
          stem: { type: 'string' },
          kind: { type: 'string', enum: ['mcq', 'numeric', 'short_text'] },
          options: { type: 'array' },
          answerKey: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          topics: { type: 'array', items: { type: 'string' } },
          difficulty: { type: 'number', minimum: 1, maximum: 5 }
        },
        required: ['stem', 'kind', 'answerKey', 'topics', 'difficulty']
      }
    }
  }, async (request, reply) => {
    const questionData = request.body as any;

    const question = new Question(questionData);
    await question.save();

    return {
      id: (question._id as any).toString(),
      message: 'Question created successfully'
    };
  });

  // Create test
  fastify.post('/tests', {
    schema: {
      body: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['placement', 'topic'] },
          title: { type: 'string' },
          description: { type: 'string' },
          gradeRange: { type: 'array', items: { type: 'string' } },
          topics: { type: 'array', items: { type: 'string' } },
          timeLimitSec: { type: 'number' },
          questionRefs: { type: 'array' },
          isActive: { type: 'boolean' }
        },
        required: ['type', 'title', 'gradeRange', 'topics', 'questionRefs']
      }
    }
  }, async (request, reply) => {
    const testData = request.body as any;

    const test = new Test(testData);
    await test.save();

    return {
      id: (test._id as any).toString(),
      message: 'Test created successfully'
    };
  });
  // Add this route to your existing adminRoutes function
  // Get all tests (ADD THIS BEFORE OR AFTER THE STATS ENDPOINT)
  fastify.get('/tests', async (request, reply) => {
    const tests = await Test.find({})
      .sort({ createdAt: -1 })
      .select('_id title description type gradeRange topics timeLimitSec isActive createdAt');

    return {
      tests: tests.map(test => ({
        id: (test._id as any).toString(),
        title: test.title,
        description: test.description,
        type: test.type,
        gradeRange: test.gradeRange,
        topics: test.topics,
        timeLimitSec: test.timeLimitSec,
        isActive: test.isActive
      }))
    };
  });
  // Get admin stats
  fastify.get('/stats/overview', async (request, reply) => {
    const [
      totalUsers,
      totalLessons,
      totalQuestions,
      totalTests,
      totalAttempts,
      recentAttempts,
      levelDistribution
    ] = await Promise.all([
      User.countDocuments(),
      Lesson.countDocuments(),
      Question.countDocuments(),
      Test.countDocuments(),
      TestAttempt.countDocuments(),
      TestAttempt.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email'),
      LevelScore.aggregate([
        { $group: { _id: '$level', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    return {
      overview: {
        totalUsers,
        totalLessons,
        totalQuestions,
        totalTests,
        totalAttempts
      },
      recentActivity: {
        recentAttempts: recentAttempts.map(attempt => ({
          id: (attempt._id as any).toString(),
          userId: attempt.userId,
          testId: attempt.testId.toString(),
          totalScore: attempt.totalScore,
          submittedAt: attempt.submittedAt
        }))
      },
      analytics: {
        levelDistribution
      }
    };
  });
}
