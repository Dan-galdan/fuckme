import { connectDatabase } from '../db/connection.js';
import { Lesson } from '../db/models/index.js';

const lessons = [
  {
    title: 'Kinematics Basics',
    slug: 'kinematics-basics',
    grade: '6',
    topics: ['kinematics'],
    difficulty: 1,
    type: 'video',
    contentUrl: 'https://example.com/videos/kinematics-basics',
    isPublished: true
  },
  {
    title: 'Force and Motion',
    slug: 'force-and-motion',
    grade: '6',
    topics: ['forces'],
    difficulty: 2,
    type: 'reading',
    contentUrl: 'https://example.com/articles/force-and-motion',
    isPublished: true
  },
  {
    title: 'Energy Conservation',
    slug: 'energy-conservation',
    grade: '7',
    topics: ['energy'],
    difficulty: 3,
    type: 'exercise',
    contentUrl: 'https://example.com/exercises/energy-conservation',
    isPublished: true
  },
  {
    title: 'Wave Properties',
    slug: 'wave-properties',
    grade: '8',
    topics: ['waves'],
    difficulty: 3,
    type: 'video',
    contentUrl: 'https://example.com/videos/wave-properties',
    isPublished: true
  },
  {
    title: 'Electric Circuits',
    slug: 'electric-circuits',
    grade: '9',
    topics: ['electricity'],
    difficulty: 4,
    type: 'reading',
    contentUrl: 'https://example.com/articles/electric-circuits',
    isPublished: true
  },
  {
    title: 'Magnetic Fields',
    slug: 'magnetic-fields',
    grade: '10',
    topics: ['magnetism'],
    difficulty: 4,
    type: 'video',
    contentUrl: 'https://example.com/videos/magnetic-fields',
    isPublished: true
  },
  {
    title: 'Optical Phenomena',
    slug: 'optical-phenomena',
    grade: '11',
    topics: ['optics'],
    difficulty: 5,
    type: 'exercise',
    contentUrl: 'https://example.com/exercises/optical-phenomena',
    isPublished: true
  },
  {
    title: 'Thermodynamics Laws',
    slug: 'thermodynamics-laws',
    grade: '12',
    topics: ['thermodynamics'],
    difficulty: 5,
    type: 'video',
    contentUrl: 'https://example.com/videos/thermodynamics-laws',
    isPublished: true
  },
  {
    title: 'Quantum Mechanics Introduction',
    slug: 'quantum-mechanics-intro',
    grade: 'EESH',
    topics: ['quantum'],
    difficulty: 5,
    type: 'reading',
    contentUrl: 'https://example.com/articles/quantum-mechanics-intro',
    isPublished: true
  },
  {
    title: 'Special Relativity',
    slug: 'special-relativity',
    grade: 'EESH',
    topics: ['relativity'],
    difficulty: 5,
    type: 'video',
    contentUrl: 'https://example.com/videos/special-relativity',
    isPublished: true
  }
];

async function seedLessons() {
  try {
    await connectDatabase();
    
    console.log('Seeding lessons...');
    
    for (const lessonData of lessons) {
      const existingLesson = await Lesson.findOne({ slug: lessonData.slug });
      if (!existingLesson) {
        const lesson = new Lesson(lessonData);
        await lesson.save();
        console.log(`Created lesson: ${lesson.title}`);
      } else {
        console.log(`Lesson already exists: ${lessonData.title}`);
      }
    }
    
    console.log('Lessons seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding lessons:', error);
    process.exit(1);
  }
}

seedLessons();
