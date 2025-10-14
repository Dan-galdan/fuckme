import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectDatabase, disconnectDatabase } from '../db/connection.js';
import { User, Question, Lesson } from '../db/models/index.js';
import { hashPassword } from '../utils/auth.js';
import { computeLevel, pickWeakTopics } from '../modules/tests/placementLogic.js';

describe('Physics School Backend', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Authentication', () => {
    it('should hash passwords securely', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });
  });

  describe('Placement Logic', () => {
    it('should compute correct levels for different grades', () => {
      expect(computeLevel(45, '6')).toBe('L2');
      expect(computeLevel(75, '10')).toBe('L3');
      expect(computeLevel(90, '12')).toBe('L5');
      expect(computeLevel(25, 'EESH')).toBe('L1');
    });

    it('should pick weak topics correctly', () => {
      const topicStats = {
        'kinematics': { correct: 2, total: 5 },
        'forces': { correct: 4, total: 5 },
        'energy': { correct: 1, total: 5 },
        'waves': { correct: 3, total: 5 }
      };

      const weakTopics = pickWeakTopics(topicStats, 2);
      expect(weakTopics).toEqual(['energy', 'kinematics']);
    });
  });

  describe('Database Models', () => {
    it('should create a user', async () => {
      const passwordHash = await hashPassword('testpassword123');
      
      const user = new User({
        name: 'Test User',
        phone: '+976-9999-9999',
        email: 'test@example.com',
        grade: '10',
        goals: ['Test goal'],
        passwordHash,
        roles: ['student']
      });

      await user.save();
      expect(user._id).toBeDefined();
      expect(user.name).toBe('Test User');
      
      // Clean up
      await User.findByIdAndDelete(user._id);
    });

    it('should create a question', async () => {
      const question = new Question({
        stem: 'What is the SI unit of velocity?',
        kind: 'mcq',
        options: [
          { id: 'a', text: 'm/s', isCorrect: true },
          { id: 'b', text: 'm/s²', isCorrect: false }
        ],
        answerKey: 'a',
        topics: ['kinematics'],
        difficulty: 1
      });

      await question.save();
      expect(question._id).toBeDefined();
      expect(question.stem).toBe('What is the SI unit of velocity?');
      
      // Clean up
      await Question.findByIdAndDelete(question._id);
    });

    it('should create a lesson', async () => {
      const lesson = new Lesson({
        title: 'Kinematics Basics',
        slug: 'kinematics-basics',
        grade: '10',
        topics: ['kinematics'],
        difficulty: 2,
        type: 'video',
        contentUrl: 'https://example.com/video',
        isPublished: true
      });

      await lesson.save();
      expect(lesson._id).toBeDefined();
      expect(lesson.title).toBe('Kinematics Basics');
      
      // Clean up
      await Lesson.findByIdAndDelete(lesson._id);
    });
  });
});
