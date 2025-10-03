import { connectDatabase } from '../db/connection.js';
import { Question } from '../db/models/index.js';

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
    difficulty: 1
  },
  {
    stem: 'A car accelerates from rest to 20 m/s in 5 seconds. What is its acceleration?',
    kind: 'numeric',
    answerKey: 4,
    topics: ['kinematics'],
    difficulty: 2
  },
  {
    stem: 'What is Newton\'s first law of motion?',
    kind: 'short_text',
    answerKey: /inertia|rest|uniform|straight/i,
    topics: ['forces'],
    difficulty: 2
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
    difficulty: 3
  },
  {
    stem: 'Calculate the kinetic energy of a 2kg object moving at 10 m/s.',
    kind: 'numeric',
    answerKey: 100,
    topics: ['energy'],
    difficulty: 3
  },
  {
    stem: 'What is the frequency of a wave with wavelength 2m and speed 4 m/s?',
    kind: 'numeric',
    answerKey: 2,
    topics: ['waves'],
    difficulty: 4
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
    difficulty: 4
  },
  {
    stem: 'What is the magnetic field inside a solenoid?',
    kind: 'short_text',
    answerKey: /uniform|constant|parallel/i,
    topics: ['magnetism'],
    difficulty: 5
  },
  {
    stem: 'Calculate the refractive index of a medium where light travels at 2×10⁸ m/s.',
    kind: 'numeric',
    answerKey: 1.5,
    topics: ['optics'],
    difficulty: 5
  },
  {
    stem: 'What is the efficiency of a heat engine operating between temperatures 300K and 600K?',
    kind: 'numeric',
    answerKey: 0.5,
    topics: ['thermodynamics'],
    difficulty: 5
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
    difficulty: 5
  },
  {
    stem: 'What happens to time dilation as velocity approaches the speed of light?',
    kind: 'short_text',
    answerKey: /increases|slows|dilates/i,
    topics: ['relativity'],
    difficulty: 5
  }
];

async function seedQuestions() {
  try {
    await connectDatabase();
    
    console.log('Seeding questions...');
    
    for (const questionData of questions) {
      const question = new Question(questionData);
      await question.save();
      console.log(`Created question: ${question.stem.substring(0, 50)}...`);
    }
    
    console.log('Questions seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
}

seedQuestions();
