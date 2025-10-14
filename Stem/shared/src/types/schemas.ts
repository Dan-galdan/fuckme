import { z } from 'zod';

// User schemas
export const UserGradeSchema = z.enum(['6', '7', '8', '9', '10', '11', '12', 'EESH']);
export const UserRoleSchema = z.enum(['student', 'admin']);

export const RegisterInitSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[0-9+\-\s()]+$/).min(8).max(20),
  email: z.string().email(),
  grade: UserGradeSchema,
  goals: z.array(z.string()).min(1).max(10),
  password: z.string().min(8).max(100)
});

export const LoginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(1)
}).refine(data => data.email || data.phone, {
  message: "Either email or phone must be provided"
});

export const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  grade: UserGradeSchema,
  goals: z.array(z.string()),
  emailVerifiedAt: z.date().optional(),
  roles: z.array(UserRoleSchema),
  subscriptionStatus: z.enum(['inactive', 'active', 'past_due', 'canceled']),
  currentLevel: z.union([z.string(), z.number()]).optional(),
  createdAt: z.date()
});

// Test schemas
export const QuestionTypeSchema = z.enum(['mcq', 'numeric', 'short_text']);
export const TestTypeSchema = z.enum(['placement', 'topic']);

export const MCQOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean().optional()
});

export const QuestionSchema = z.object({
  _id: z.string(),
  stem: z.string(),
  kind: QuestionTypeSchema,
  options: z.array(MCQOptionSchema).optional(),
  answerKey: z.union([z.number(), z.string(), z.instanceof(RegExp)]),
  topics: z.array(z.string()),
  difficulty: z.number().min(1).max(5)
});

export const TestSchema = z.object({
  _id: z.string(),
  type: TestTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  gradeRange: z.array(UserGradeSchema),
  topics: z.array(z.string()),
  timeLimitSec: z.number().optional(),
  questionRefs: z.array(z.object({
    questionId: z.string(),
    weight: z.number().min(0).max(1),
    difficulty: z.number().min(1).max(5)
  })),
  isActive: z.boolean()
});

export const TestAttemptItemSchema = z.object({
  questionId: z.string(),
  answer: z.union([z.string(), z.number()]),
  correct: z.boolean(),
  score: z.number(),
  topicTags: z.array(z.string())
});

export const TestAttemptSchema = z.object({
  userId: z.string(),
  testId: z.string(),
  startedAt: z.date(),
  submittedAt: z.date().optional(),
  items: z.array(TestAttemptItemSchema),
  totalScore: z.number(),
  levelEstimate: z.string().optional(),
  summaryWeakTopics: z.array(z.string())
});

// Lesson schemas
export const LessonTypeSchema = z.enum(['video', 'reading', 'exercise']);
export const LessonSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  grade: UserGradeSchema,
  topics: z.array(z.string()),
  difficulty: z.number().min(1).max(5),
  contentUrl: z.string().optional(),
  contentUrls: z.array(z.string()).optional(),
  type: LessonTypeSchema,
  isPublished: z.boolean(),
  createdAt: z.date()
});

// Payment schemas
export const PaymentProviderSchema = z.enum(['mock', 'qpay']);
export const PaymentStatusSchema = z.enum(['pending', 'paid', 'failed']);

export const PaymentSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  provider: PaymentProviderSchema,
  status: PaymentStatusSchema,
  amount: z.number(),
  currency: z.string(),
  sessionId: z.string(),
  externalRef: z.string().optional(),
  createdAt: z.date()
});

export const SubscriptionSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  status: z.enum(['inactive', 'active', 'past_due', 'canceled']),
  planId: z.string().optional(),
  currentPeriodEnd: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Level and Recommendation schemas
export const LevelScoreSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  source: z.enum(['placement', 'retest']),
  level: z.union([z.string(), z.number()]),
  scorePercent: z.number().min(0).max(100),
  topicsProfile: z.record(z.string(), z.number().min(0).max(1)),
  createdAt: z.date()
});

export const RecommendationSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  computedAt: z.date(),
  lessonIds: z.array(z.string()),
  rationale: z.string()
});

// API Request/Response schemas
export const CreatePaymentSessionSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('MNT'),
  planId: z.string().optional()
});

export const SubmitTestAttemptSchema = z.object({
  testId: z.string(),
  placementSessionId: z.string().optional(),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.union([z.string(), z.number()])
  }))
});

// Type exports
export type UserGrade = z.infer<typeof UserGradeSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type RegisterInit = z.infer<typeof RegisterInitSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type User = z.infer<typeof UserSchema>;
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type TestType = z.infer<typeof TestTypeSchema>;
export type MCQOption = z.infer<typeof MCQOptionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Test = z.infer<typeof TestSchema>;
export type TestAttemptItem = z.infer<typeof TestAttemptItemSchema>;
export type TestAttempt = z.infer<typeof TestAttemptSchema>;
export type LessonType = z.infer<typeof LessonTypeSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type PaymentProvider = z.infer<typeof PaymentProviderSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type LevelScore = z.infer<typeof LevelScoreSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type CreatePaymentSession = z.infer<typeof CreatePaymentSessionSchema>;
export type SubmitTestAttempt = z.infer<typeof SubmitTestAttemptSchema>;
