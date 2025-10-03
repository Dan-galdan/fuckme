import { FastifyInstance } from 'fastify';
import { Lesson } from '../../db/models/index.js';

export default async function lessonRoutes(fastify: FastifyInstance) {
  // Get lessons with filters
  fastify.get('/', async (request, reply) => {
    const query = request.query as any;
    const { grade, topics, difficulty, search, page = 1, limit = 10 } = query;
    
    const filter: any = { isPublished: true };
    
    if (grade) filter.grade = grade;
    if (topics) filter.topics = { $in: Array.isArray(topics) ? topics : [topics] };
    if (difficulty) filter.difficulty = parseInt(difficulty);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topics: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const lessons = await Lesson.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Lesson.countDocuments(filter);
    
    return {
      lessons: lessons.map(lesson => ({
        id: (lesson._id as any).toString(),
        title: lesson.title,
        slug: lesson.slug,
        grade: lesson.grade,
        topics: lesson.topics,
        difficulty: lesson.difficulty,
        type: lesson.type,
        contentUrl: lesson.contentUrl,
        contentUrls: lesson.contentUrls,
        createdAt: lesson.createdAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };
  });
  
  // Get single lesson
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    
    const lesson = await Lesson.findById(id);
    if (!lesson || !lesson.isPublished) {
      return reply.status(404).send({
        error: 'Lesson not found',
        message: 'The specified lesson does not exist or is not published'
      });
    }
    
    return {
      id: (lesson._id as any).toString(),
      title: lesson.title,
      slug: lesson.slug,
      grade: lesson.grade,
      topics: lesson.topics,
      difficulty: lesson.difficulty,
      type: lesson.type,
      contentUrl: lesson.contentUrl,
      contentUrls: lesson.contentUrls,
      createdAt: lesson.createdAt
    };
  });
}
