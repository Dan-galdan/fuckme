import { connectDatabase } from '../db/connection.js';
import { Question, Test } from '../db/models/index.js';

const questions = [
  {
    stem: 'What is the SI unit of velocity?',
    kind: 'mcq',
    options: [
      { id: 'a', text: 'm/s', isCorrect: true },
      { id: 'b', text: 'm/s²', isCorrect: false },
      { id: 'c', text: 'kg', isCorrect: false },
      { id: 'd', text: 'N', isCorrect: false }
    ],
    answerKey: 'a',
    topics: ['kinematics'],
    difficulty: 1,
    grade: '6',
    subject: 'physics'
  },
  {
    stem: 'A car accelerates from rest to 20 m/s in 5 seconds. What is its acceleration?',
    kind: 'numeric',
    answerKey: 4,
    topics: ['kinematics'],
    difficulty: 2,
    grade: '7',
    subject: 'physics'
  },
  {
    stem: 'What is Newton\'s first law of motion?',
    kind: 'short_text',
    answerKey: /inertia|rest|uniform|straight/i,
    topics: ['forces'],
    difficulty: 2,
    grade: '8',
    subject: 'physics'
  },
  {
    stem: 'Which of the following is a vector quantity?',
    kind: 'mcq',
    options: [
      { id: 'a', text: 'Speed', isCorrect: false },
      { id: 'b', text: 'Velocity', isCorrect: true },
      { id: 'c', text: 'Distance', isCorrect: false },
      { id: 'd', text: 'Temperature', isCorrect: false }
    ],
    answerKey: 'b',
    topics: ['kinematics'],
    difficulty: 3,
    grade: '9',
    subject: 'physics'
  },
  {
    stem: 'Calculate the kinetic energy of a 2kg object moving at 10 m/s.',
    kind: 'numeric',
    answerKey: 100,
    topics: ['energy'],
    difficulty: 3,
    grade: '10',
    subject: 'physics'
  },
  {
    stem: 'What is the frequency of a wave with wavelength 2m and speed 4 m/s?',
    kind: 'numeric',
    answerKey: 2,
    topics: ['waves'],
    difficulty: 4,
    grade: '11',
    subject: 'physics'
  },
  {
    stem: 'In an electric circuit, what does Ohm\'s law relate?',
    kind: 'mcq',
    options: [
      { id: 'a', text: 'Voltage, current, and resistance', isCorrect: true },
      { id: 'b', text: 'Power, energy, and time', isCorrect: false },
      { id: 'c', text: 'Force, mass, and acceleration', isCorrect: false },
      { id: 'd', text: 'Charge, current, and time', isCorrect: false }
    ],
    answerKey: 'a',
    topics: ['electricity'],
    difficulty: 4,
    grade: '12',
    subject: 'physics'
  },
  {
    stem: 'What is the magnetic field inside a solenoid?',
    kind: 'short_text',
    answerKey: /uniform|constant|parallel/i,
    topics: ['magnetism'],
    difficulty: 5,
    grade: 'EESH',
    subject: 'physics'
  },
  {
    stem: 'Calculate the refractive index of a medium where light travels at 2×10⁸ m/s.',
    kind: 'numeric',
    answerKey: 1.5,
    topics: ['optics'],
    difficulty: 5,
    grade: 'EESH',
    subject: 'physics'
  },
  {
    stem: 'What is the efficiency of a heat engine operating between temperatures 300K and 600K?',
    kind: 'numeric',
    answerKey: 0.5,
    topics: ['thermodynamics'],
    difficulty: 5,
    grade: 'EESH',
    subject: 'physics'
  },
  {
    stem: 'Which principle explains the photoelectric effect?',
    kind: 'mcq',
    options: [
      { id: 'a', text: 'Wave-particle duality', isCorrect: true },
      { id: 'b', text: 'Conservation of energy', isCorrect: false },
      { id: 'c', text: 'Uncertainty principle', isCorrect: false },
      { id: 'd', text: 'Pauli exclusion principle', isCorrect: false }
    ],
    answerKey: 'a',
    topics: ['quantum'],
    difficulty: 5,
    grade: 'EESH',
    subject: 'physics'
  },
  {
    stem: 'What happens to time dilation as velocity approaches the speed of light?',
    kind: 'short_text',
    answerKey: /increases|slows|dilates/i,
    topics: ['relativity'],
    difficulty: 5,
    grade: 'EESH',
    subject: 'physics'
  },
  // Additional questions for better coverage
  {
    stem: 'What is the SI unit of force?',
    kind: 'mcq',
    options: [
      { id: 'a', text: 'Newton', isCorrect: true },
      { id: 'b', text: 'Joule', isCorrect: false },
      { id: 'c', text: 'Watt', isCorrect: false },
      { id: 'd', text: 'Pascal', isCorrect: false }
    ],
    answerKey: 'a',
    topics: ['forces'],
    difficulty: 1,
    grade: '6',
    subject: 'physics'
  },
  {
    stem: 'What type of energy is stored in a stretched spring?',
    kind: 'mcq',
    options: [
      { id: 'a', text: 'Kinetic energy', isCorrect: false },
      { id: 'b', text: 'Potential energy', isCorrect: true },
      { id: 'c', text: 'Thermal energy', isCorrect: false },
      { id: 'd', text: 'Chemical energy', isCorrect: false }
    ],
    answerKey: 'b',
    topics: ['energy'],
    difficulty: 2,
    grade: '7',
    subject: 'physics'
  },
  {
    stem: 'What is the speed of light in vacuum?',
    kind: 'numeric',
    answerKey: 299792458,
    topics: ['waves', 'optics'],
    difficulty: 3,
    grade: '10',
    subject: 'physics'
  }
];

async function seedQuestions() {
  try {
    await connectDatabase();

    console.log('🗑️ Clearing existing questions and tests...');

    // Clear existing data
    await Question.deleteMany({});
    await Test.deleteMany({ type: 'placement' });

    console.log('📦 Seeding questions...');

    // Insert questions
    for (const questionData of questions) {
      const question = new Question(questionData);
      await question.save();
      console.log(`✅ Created question: ${question.stem.substring(0, 50)}...`);
    }

    console.log('🎯 Creating placement tests for each grade...');

    // Create placement tests for each grade
    const grades = ['6', '7', '8', '9', '10', '11', '12', 'EESH'];

    for (const grade of grades) {
      const gradeQuestions = await Question.find({ grade });

      if (gradeQuestions.length > 0) {
        const placementTest = new Test({
          type: 'placement',
          title: `Placement Test - Grade ${grade}`,
          description: 'Determine your current physics level',
          gradeRange: [grade],
          topics: Array.from(new Set(gradeQuestions.flatMap(q => q.topics))),
          questionRefs: gradeQuestions.map(q => ({
            questionId: q._id,
            weight: 1,
            difficulty: q.difficulty
          })),
          timeLimitSec: 3600,
          isActive: true
        });

        await placementTest.save();
        console.log(`✅ Created placement test for grade ${grade} with ${gradeQuestions.length} questions`);
      } else {
        console.log(`⚠️ No questions found for grade ${grade}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 You can now test the placement test at: http://localhost:4000/api/tests/placement?grade=6');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    process.exit(1);
  }
}

seedQuestions();