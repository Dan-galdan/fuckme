import { FastifyInstance } from 'fastify';
import { User, TestAttempt, LevelScore, PlacementSession } from '../../db/models/index.js';
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/auth.js';
import { computeRecommendations, saveRecommendations } from '../recommendations/service.js';

export default async function authRoutes(fastify: FastifyInstance) {
  // Register initialization (before placement test)
  fastify.post('/register-init', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100 },
          phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', minLength: 8, maxLength: 20 },
          email: { type: 'string', format: 'email' },
          grade: { type: 'string', enum: ['6', '7', '8', '9', '10', '11', '12', 'EESH'] },
          goals: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 10 },
          password: { type: 'string', minLength: 8, maxLength: 100 }
        },
        required: ['name', 'phone', 'email', 'grade', 'goals', 'password']
      }
    }
  }, async (request, reply) => {
    const { name, phone, email, grade, goals, password } = request.body as any;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return reply.status(400).send({
        error: 'User already exists',
        message: 'A user with this email or phone already exists'
      });
    }

    // Create placement session in database
    const placementSessionId = `placement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store registration data in database
    const placementSession = new PlacementSession({
      sessionId: placementSessionId,
      name,
      phone,
      email,
      grade,
      goals,
      password
    });

    await placementSession.save();

    console.log(`Placement session created: ${placementSessionId} for ${email}`);

    return {
      placementSessionId,
      message: 'Registration initialized. Please complete the placement test.'
    };
  });

  // Complete registration (after placement test)
  fastify.post('/complete-registration', {
    schema: {
      body: {
        type: 'object',
        properties: {
          placementSessionId: { type: 'string' },
          placementResults: { type: 'object' }
        },
        required: ['placementSessionId', 'placementResults']
      }
    }
  }, async (request, reply) => {
    const { placementSessionId, placementResults } = request.body as any;

    // Get registration data from database
    console.log(`Complete registration: Looking for session ${placementSessionId}`);
    const sessionData = await PlacementSession.findOne({ sessionId: placementSessionId });
    if (!sessionData) {
      console.log(`Complete registration: Session not found ${placementSessionId}`);
      return reply.status(400).send({
        error: 'Invalid session',
        message: 'Placement session not found or expired'
      });
    }
    console.log(`Complete registration: Session found for ${sessionData.email}`);

    // Hash password and create user
    const passwordHash = await hashPassword(sessionData.password);

    const user = new User({
      name: sessionData.name,
      phone: sessionData.phone,
      email: sessionData.email,
      grade: sessionData.grade,
      goals: sessionData.goals,
      passwordHash,
      roles: ['student'],
      subscriptionStatus: 'inactive'
    });

    await user.save();

    // Create LevelScore record from placement test results
    if (placementResults && placementResults.levelEstimate && placementResults.topicsProfile) {
      const levelScore = new LevelScore({
        userId: user._id,
        source: 'placement',
        level: placementResults.levelEstimate,
        scorePercent: placementResults.totalScore || 0,
        topicsProfile: placementResults.topicsProfile,
        weakTopics: placementResults.weakTopics || []
      });

      await levelScore.save();

      // Generate recommendations based on placement test results
      try {
        const lessonIds = await computeRecommendations((user._id as any).toString());
        const rationale = `Initial recommendations based on placement test results. Level: ${placementResults.levelEstimate}, Weak topics: ${(placementResults.weakTopics || []).join(', ')}`;

        if (lessonIds.length > 0) {
          await saveRecommendations((user._id as any).toString(), lessonIds, rationale);
        }
      } catch (error) {
        // Log error but don't fail registration
        console.error('Error generating recommendations:', error);
      }
    }

    // Clean up session data from database
    await PlacementSession.deleteOne({ sessionId: placementSessionId });

    // Generate tokens
    const tokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      roles: user.roles
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Set cookies
    reply.setCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    });

    return {
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        grade: user.grade,
        roles: user.roles
      },
      message: 'Registration completed successfully'
    };
  });

  // Login
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          password: { type: 'string', minLength: 1 }
        },
        anyOf: [
          { required: ['email', 'password'] },
          { required: ['phone', 'password'] }
        ]
      }
    }
  }, async (request, reply) => {
    const { email, phone, password } = request.body as any;

    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (!user || !await verifyPassword(user.passwordHash, password)) {
      return reply.status(401).send({
        error: 'Invalid credentials',
        message: 'Email/phone or password is incorrect'
      });
    }

    // Generate tokens
    const tokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      roles: user.roles
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Set cookies
    reply.setCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    });

    return {
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        grade: user.grade,
        roles: user.roles
      },
      message: 'Login successful'
    };
  });

  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return reply.status(401).send({
        error: 'No refresh token',
        message: 'Refresh token not provided'
      });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return reply.status(401).send({
        error: 'Invalid refresh token',
        message: 'Refresh token is invalid or expired'
      });
    }

    // Generate new access token
    const tokenPayload = {
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles
    };
    const accessToken = generateAccessToken(tokenPayload);

    reply.setCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    });

    return { message: 'Token refreshed successfully' };
  });

  // Logout
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('accessToken');
    reply.clearCookie('refreshToken');

    return { message: 'Logout successful' };
  });
  fastify.get('/test-history', async (request, reply) => {
    const token = request.cookies.accessToken;

    if (!token) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const payload = verifyRefreshToken(token);
    if (!payload) {
      return reply.status(401).send({
        error: 'Invalid token',
        message: 'Authentication token is invalid'
      });
    }

    try {
      // Get user's test attempts
      const attempts = await TestAttempt.find({ userId: payload.userId })
        .populate('testId', 'title')
        .sort({ submittedAt: -1 })
        .limit(10);

      // Calculate stats
      const totalTests = attempts.length;
      const averageScore = totalTests > 0
        ? attempts.reduce((sum, attempt) => sum + attempt.totalScore, 0) / totalTests
        : 0;

      // Get current level from latest level score
      const latestLevelScore = await LevelScore.findOne({ userId: payload.userId })
        .sort({ createdAt: -1 });

      return {
        attempts: attempts.map(attempt => ({
          attemptId: (attempt._id as any).toString(),
          testId: (attempt.testId as any)?._id?.toString() || 'unknown',
          testTitle: (attempt.testId as any)?.title || 'Test',
          score: attempt.totalScore,
          levelEstimate: attempt.levelEstimate,
          completedAt: attempt.submittedAt
        })),
        averageScore: Math.round(averageScore),
        totalTests,
        currentLevel: latestLevelScore?.level || 'Not assessed'
      };
    } catch (error) {
      console.error('Error fetching test history:', error);
      return reply.status(500).send({
        error: 'Server error',
        message: 'Failed to fetch test history'
      });
    }
  });
}
