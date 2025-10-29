import { FastifyInstance } from 'fastify';
import { Question } from '../../db/models/index.js';

export default async function questionRoutes(fastify: FastifyInstance) {
    // Create question endpoint
    fastify.post('/', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    stem: { type: 'string' },
                    kind: { type: 'string', enum: ['mcq', 'numeric', 'short_text'] },
                    options: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                text: { type: 'string' },
                                isCorrect: { type: 'boolean' },
                                imageUrl: { type: 'string' } // ✅ Include imageUrl
                            }
                        }
                    },
                    answerKey: {},
                    topics: { type: 'array', items: { type: 'string' } },
                    difficulty: { type: 'number' },
                    imageUrl: { type: 'string' }, // ✅ Include imageUrl for question
                    grade: { type: 'string' },
                    subject: { type: 'string' }
                },
                required: ['stem', 'kind', 'topics', 'difficulty', 'grade', 'subject']
            }
        }
    }, async (request, reply) => {
        try {
            const questionData = request.body as any;

            console.log('🖼️ BACKEND - Creating question with image data:', {
                hasQuestionImage: !!questionData.imageUrl,
                questionImageUrl: questionData.imageUrl,
                optionsWithImages: questionData.options?.filter((opt: any) => opt.imageUrl).map((opt: any) => ({
                    text: opt.text,
                    imageUrl: opt.imageUrl
                })) || []
            });

            // ✅ Make sure imageUrl and option imageUrls are preserved
            const question = new Question({
                ...questionData,
                options: questionData.options?.map((opt: any) => ({
                    ...opt,
                    imageUrl: opt.imageUrl || undefined // Preserve imageUrl if exists
                })) || []
            });

            await question.save();

            console.log('✅ BACKEND - Question created with ID:', question._id);
            console.log('🖼️ BACKEND - Saved question image data:', {
                savedQuestionImage: question.imageUrl,
                savedOptionImages: question.options?.map(opt => opt.imageUrl).filter(Boolean)
            });

            return {
                id: question._id.toString(),
                message: 'Question created successfully'
            };
        } catch (error) {
            console.error('❌ BACKEND - Error creating question:', error);
            return reply.status(500).send({
                error: 'Failed to create question',
                message: error.message
            });
        }
    });

    // Get question by ID (for testing)
    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params as any;

        const question = await Question.findById(id);
        if (!question) {
            return reply.status(404).send({ error: 'Question not found' });
        }

        console.log('🖼️ BACKEND - Retrieved question image data:', {
            id: question._id.toString(),
            hasQuestionImage: !!question.imageUrl,
            questionImageUrl: question.imageUrl,
            optionsWithImages: question.options?.filter((opt: any) => opt.imageUrl).map((opt: any) => ({
                text: opt.text,
                imageUrl: opt.imageUrl
            })) || []
        });

        return question;
    });
}