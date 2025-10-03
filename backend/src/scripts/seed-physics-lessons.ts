import { connectDatabase } from '../db/connection.js';
import { Lesson } from '../db/models/index.js';

const physicsLessons = [
  // Grade 6 lessons
  {
    title: "Яндан дуран",
    slug: "periscope-grade-6",
    grade: "6",
    topics: ["optics", "reflection"],
    difficulty: 2,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/b_D62-Rt1dI?si=889Q8g5rWlLoFgmx",
    isPublished: true
  },
  {
    title: "Дүүжин долгион",
    slug: "pendulum-grade-6",
    grade: "6",
    topics: ["kinematics", "oscillation"],
    difficulty: 2,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/_8JMVl-_KKs?si=qcPrsWdYlHPt3OEC",
    isPublished: true
  },
  {
    title: "Хувьсагч олох",
    slug: "variables-grade-6",
    grade: "6",
    topics: ["mathematics", "problem-solving"],
    difficulty: 1,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/UnSf3_fEc_s?si=c5pNPHc6bAyXVVnw",
    isPublished: true
  },
  {
    title: "Дуу авиа",
    slug: "sound-waves-grade-6",
    grade: "6",
    topics: ["waves", "sound"],
    difficulty: 2,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/urNwlDMqbM8?si=jCyMvux4W1HO6CbV",
    isPublished: true
  },

  // Grade 7 lessons
  {
    title: "Соронзон орон",
    slug: "magnetic-field-grade-7",
    grade: "7",
    topics: ["magnetism", "forces"],
    difficulty: 3,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/1Nr-KtlMIKI?si=j5h5g9639CbzrrHN",
    isPublished: true
  },
  {
    title: "Цахилгаан хэлхээ",
    slug: "electric-circuit-grade-7",
    grade: "7",
    topics: ["electricity", "circuits"],
    difficulty: 3,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/BVUogksj398?si=htl3K7i3QBYOk-hk",
    isPublished: true
  },
  {
    title: "Биеийн нягт",
    slug: "density-grade-7",
    grade: "7",
    topics: ["matter", "density"],
    difficulty: 2,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/hCJKwHLeGRQ?si=LC7yO4Z7kIrfmU2M",
    isPublished: true
  },

  // Grade 8 lessons
  {
    title: "Дууны долгионууд",
    slug: "sound-waves-grade-8",
    grade: "8",
    topics: ["waves", "sound"],
    difficulty: 3,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/KFozHuNdc90?si=M_TBOol9OtPYoqSt",
    isPublished: true
  },
  {
    title: "Нарны аймаг",
    slug: "solar-system-grade-8",
    grade: "8",
    topics: ["astronomy", "gravity"],
    difficulty: 3,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/bpwk82o3ZFg?si=DQfWiy-9GKoQ5TCA",
    isPublished: true
  },
  {
    title: "Тогтмол гүйдэл",
    slug: "direct-current-grade-8",
    grade: "8",
    topics: ["electricity", "current"],
    difficulty: 3,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/P5dw1abNQ5k?si=sE4p3sHgOQSkZTDx",
    isPublished: true
  },

  // Grade 9 lessons
  {
    title: "Гэрлийн хугаралт",
    slug: "light-refraction-grade-9",
    grade: "9",
    topics: ["optics", "refraction"],
    difficulty: 4,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/KN6QXUuuCEM?si=cZ1CwUkzNkLcr4IF",
    isPublished: true
  },
  {
    title: "Цахилгаан хөдөлгүүр",
    slug: "electric-motor-grade-9",
    grade: "9",
    topics: ["electricity", "magnetism"],
    difficulty: 4,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/CWulQ1ZSE3c?si=395CHGBY2863H6tW",
    isPublished: true
  },
  {
    title: "Толь",
    slug: "mirror-grade-9",
    grade: "9",
    topics: ["optics", "reflection"],
    difficulty: 3,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/qYBHf4GZ5oQ?si=rBCxz5tbNmlOpnyu",
    isPublished: true
  },
  {
    title: "Линз - Хүний нүд",
    slug: "lens-eye-grade-9",
    grade: "9",
    topics: ["optics", "lens"],
    difficulty: 4,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/e0d3-wX8cwM?si=g_cMKa8GDeF3-t_g",
    isPublished: true
  },

  // Grade 10 lessons
  {
    title: "Жигд хувьсах хөдөлгөөн",
    slug: "uniform-motion-grade-10",
    grade: "10",
    topics: ["kinematics", "motion"],
    difficulty: 4,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/9ePpWrvOXGY?si=-YkbZ_9ISD2RakBt",
    isPublished: true
  },
  {
    title: "Өнцөг үүсгэн шидсэн биеийн хөдөлгөөн",
    slug: "projectile-motion-grade-10",
    grade: "10",
    topics: ["kinematics", "projectile"],
    difficulty: 5,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/2gW6-0G-3AA?si=GQSy_pR5OadG9OoH",
    isPublished: true
  },
  {
    title: "Өнцөг үүсгэн шидсэн бие",
    slug: "projectile-body-grade-10",
    grade: "10",
    topics: ["kinematics", "projectile"],
    difficulty: 5,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/Gsa6X01Kduo?si=m0usmtLl1Bd4ohwN",
    isPublished: true
  },

  // Grade 11 lessons
  {
    title: "Arduino robot кодчилол",
    slug: "arduino-robot-grade-11",
    grade: "11",
    topics: ["programming", "robotics"],
    difficulty: 5,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/z524YqJvyak?si=bz_IuB-Hb5L9yil0",
    isPublished: true
  },
  {
    title: "Дулаан дамжуулах",
    slug: "heat-transfer-grade-11",
    grade: "11",
    topics: ["thermodynamics", "heat"],
    difficulty: 4,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/Rnnadk7b3VY?si=ncLYCNETqVgWmmW0",
    isPublished: true
  },
  {
    title: "Термодинамик Хийн хуулиуд",
    slug: "gas-laws-grade-11",
    grade: "11",
    topics: ["thermodynamics", "gas-laws"],
    difficulty: 5,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/YhkzEZm--zQ",
    isPublished: true
  },

  // EESH lessons
  {
    title: "ЭЕШ - Физикийн үндэс",
    slug: "eesh-physics-basics",
    grade: "EESH",
    topics: ["kinematics", "forces", "energy"],
    difficulty: 5,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/example1",
    isPublished: true
  },
  {
    title: "ЭЕШ - Цахилгаан ба соронзон",
    slug: "eesh-electricity-magnetism",
    grade: "EESH",
    topics: ["electricity", "magnetism"],
    difficulty: 5,
    type: "video" as const,
    contentUrl: "https://www.youtube.com/embed/example2",
    isPublished: true
  }
];

async function seedPhysicsLessons() {
  try {
    await connectDatabase();
    
    console.log('Starting to seed physics lessons...');
    
    // Clear existing physics lessons
    await Lesson.deleteMany({});
    console.log('Cleared existing lessons');
    
    // Insert new lessons
    const insertedLessons = await Lesson.insertMany(physicsLessons);
    console.log(`Successfully inserted ${insertedLessons.length} physics lessons`);
    
    // Display summary by grade
    const gradeSummary = physicsLessons.reduce((acc, lesson) => {
      acc[lesson.grade] = (acc[lesson.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\nLessons by grade:');
    Object.entries(gradeSummary).forEach(([grade, count]) => {
      console.log(`  Grade ${grade}: ${count} lessons`);
    });
    
    console.log('\nPhysics lessons seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding physics lessons:', error);
    process.exit(1);
  }
}

seedPhysicsLessons();
