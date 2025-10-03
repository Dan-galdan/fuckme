import { FastifyInstance } from 'fastify';
import { Recommendation } from '../../db/models/index.js';
import { computeRecommendations, saveRecommendations } from './service.js';
import { verifyAccessToken } from '../../utils/auth.js';

export default async function recommendationRoutes(fastify: FastifyInstance) {
  // Get recommendations
  fastify.get('/', async (request, reply) => {
    const token = request.cookies.accessToken;
    
    // Debug logging
    fastify.log.info({
      cookies: request.cookies,
      hasToken: !!token,
      tokenLength: token?.length
    }, 'Recommendations request');
    
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
    
    // Get latest recommendations
    const recommendation = await Recommendation.findOne({ userId: payload.userId })
      .sort({ computedAt: -1 })
      .populate('lessonIds');
    
    console.log(`Retrieved recommendation for user ${payload.userId}:`, {
      found: !!recommendation,
      lessonCount: recommendation?.lessonIds?.length || 0,
      lessonIds: recommendation?.lessonIds?.map((l: any) => l._id.toString()) || []
    });
    
    if (!recommendation) {
      return {
        lessons: [],
        rationale: 'No recommendations available yet',
        computedAt: null
      };
    }
    
    return {
      lessons: recommendation.lessonIds.map((lesson: any) => ({
        id: lesson._id.toString(),
        title: lesson.title,
        slug: lesson.slug,
        grade: lesson.grade,
        topics: lesson.topics,
        difficulty: lesson.difficulty,
        type: lesson.type,
        contentUrl: lesson.contentUrl
      })),
      rationale: recommendation.rationale,
      computedAt: recommendation.computedAt
    };
  });
  
  // Recompute recommendations
  fastify.post('/recompute', async (request, reply) => {
    const token = request.cookies.accessToken;
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
    
    // Check if user is admin
    if (!payload.roles.includes('admin')) {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }
    
    const { userId } = request.body as any;
    const targetUserId = userId || payload.userId;
    
    // Compute new recommendations
    const lessonIds = await computeRecommendations(targetUserId);
    const rationale = `Recommendations computed based on latest level assessment and weak topics`;
    
    // Save recommendations
    await saveRecommendations(targetUserId, lessonIds, rationale);
    
    return {
      message: 'Recommendations recomputed successfully',
      lessonCount: lessonIds.length
    };
  });
}
