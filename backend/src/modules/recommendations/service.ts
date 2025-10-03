import { Lesson, LevelScore, Recommendation } from '../../db/models/index.js';
import { env } from '../../config/env.js';
import { pickWeakTopics } from '../tests/placementLogic.js';

export async function computeRecommendations(userId: string): Promise<string[]> {
  // Get user's latest level score
  const latestLevelScore = await LevelScore.findOne({ userId })
    .sort({ createdAt: -1 });
  
  if (!latestLevelScore) {
    // No level score yet, return basic recommendations
    return await getBasicRecommendations();
  }
  
  // Get weak topics from level score
  const weakTopics = pickWeakTopics(latestLevelScore.topicsProfile as any, 3);
  const userLevel = latestLevelScore.level;
  
  // Find lessons that match weak topics and appropriate difficulty
  const lessons = await Lesson.find({
    isPublished: true,
    topics: { $in: weakTopics },
    difficulty: { $gte: getMinDifficulty(userLevel), $lte: getMaxDifficulty(userLevel) }
  }).limit(env.RECOMMENDATION_COUNT);
  
  // If not enough lessons, fill with general recommendations
  if (lessons.length < env.RECOMMENDATION_COUNT) {
    console.log(`Only found ${lessons.length} targeted lessons, need ${env.RECOMMENDATION_COUNT}. Adding general lessons.`);
    const additionalLessons = await Lesson.find({
      isPublished: true,
      difficulty: { $gte: getMinDifficulty(userLevel), $lte: getMaxDifficulty(userLevel) },
      _id: { $nin: lessons.map(l => l._id) }
    }).limit(env.RECOMMENDATION_COUNT - lessons.length);
    
    console.log(`Found ${additionalLessons.length} additional general lessons`);
    lessons.push(...additionalLessons);
  }
  
  console.log(`Total lessons computed: ${lessons.length}`);
  return lessons.map(lesson => (lesson._id as any).toString());
}

export async function saveRecommendations(userId: string, lessonIds: string[], rationale: string) {
  console.log(`Saving recommendations for user ${userId}:`, {
    lessonCount: lessonIds.length,
    lessonIds: lessonIds,
    rationale: rationale
  });
  
  // Remove existing recommendations
  await Recommendation.deleteMany({ userId });
  
  // Create new recommendation
  const recommendation = new Recommendation({
    userId,
    computedAt: new Date(),
    lessonIds,
    rationale
  });
  
  await recommendation.save();
  console.log(`Recommendation saved with ${recommendation.lessonIds.length} lessons`);
  return recommendation;
}

function getMinDifficulty(level: string | number): number {
  const levelStr = level.toString();
  if (levelStr.startsWith('L1')) return 1;
  if (levelStr.startsWith('L2')) return 1;
  if (levelStr.startsWith('L3')) return 2;
  if (levelStr.startsWith('L4')) return 3;
  if (levelStr.startsWith('L5')) return 4;
  return 1;
}

function getMaxDifficulty(level: string | number): number {
  const levelStr = level.toString();
  if (levelStr.startsWith('L1')) return 2;
  if (levelStr.startsWith('L2')) return 3;
  if (levelStr.startsWith('L3')) return 4;
  if (levelStr.startsWith('L4')) return 5;
  if (levelStr.startsWith('L5')) return 5;
  return 3;
}

async function getBasicRecommendations(): Promise<string[]> {
  // Return basic lessons for new users
  const lessons = await Lesson.find({
    isPublished: true,
    difficulty: { $gte: 1, $lte: 3 }
  }).limit(env.RECOMMENDATION_COUNT);
  
  return lessons.map(lesson => (lesson._id as any).toString());
}
