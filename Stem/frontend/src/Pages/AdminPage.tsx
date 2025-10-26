import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/auth';
import CloudinaryUpload from '../Datas/CloudinaryUpload.js';

// Define types for API responses
interface CreateLessonResponse {
  id: string;
  message: string;
}

interface CreateTestResponse {
  id: string;
  message: string;
}

interface CreateQuestionResponse {
  id: string;
  message: string;
}

// Define option type with imageUrl
interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  imageUrl?: string;
}

function AdminPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate(); // Added to fix unused warning

  // DEBUG: Log user data
  useEffect(() => {
    console.log('🔍 ADMIN PAGE - User:', user);
    console.log('🔍 ADMIN PAGE - User roles:', user?.roles);
    console.log('🔍 ADMIN PAGE - Is admin:', !!user?.roles?.includes('admin'));
  }, [user]);

  const isAdmin = !!user?.roles?.includes('admin');

  const [lessonForm, setLessonForm] = useState({
    title: '',
    slug: '',
    grade: 'EESH',
    topics: '',
    difficulty: 3,
    type: 'reading' as 'video' | 'reading' | 'exercise',
    contentUrl: '',
    isPublished: true,
  });

  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    gradeRange: 'EESH',
    topics: '',
    timeLimitSec: 1200,
    questionIdsCsv: '',
    isActive: true,
  });

  const [questionForm, setQuestionForm] = useState({
    stem: '',
    kind: 'mcq' as 'mcq' | 'numeric' | 'short_text',
    options: [{ id: '1', text: '', isCorrect: false, imageUrl: '' }] as QuestionOption[],
    answerKey: '',
    topics: '',
    difficulty: 3,
    imageUrl: '', // ✅ Add image URL for the question
    grade: 'EESH', // ✅ Make sure these exist
    subject: 'physics' // ✅ Make sure these exist
  });

  // Add proper TypeScript types to these functions
  const handleQuestionImageUpload = (imageUrl: string) => {
    setQuestionForm({ ...questionForm, imageUrl });
  };

  const handleOptionImageUpload = (index: number, imageUrl: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = { ...newOptions[index], imageUrl };
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdmin) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="text-red-600 font-semibold">Access denied. Admins only.</div>
      </div>
    );
  }

  async function handleCreateLesson(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setIsLoading(true);

    try {
      if (!lessonForm.title.trim()) {
        throw new Error('Title is required');
      }

      const payload = {
        title: lessonForm.title.trim(),
        slug: lessonForm.slug.trim() || lessonForm.title.trim().toLowerCase().replace(/\s+/g, '-'),
        grade: lessonForm.grade,
        topics: lessonForm.topics.split(',').map((t) => t.trim()).filter(Boolean),
        difficulty: Number(lessonForm.difficulty),
        type: lessonForm.type,
        contentUrl: lessonForm.contentUrl.trim() || undefined,
        isPublished: lessonForm.isPublished,
      };

      const res = await apiClient.createLesson(payload) as CreateLessonResponse;
      setStatus(`Lesson created successfully: ${res.id}`);

      setLessonForm({
        ...lessonForm,
        title: '',
        slug: '',
        topics: '',
        contentUrl: ''
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to create lesson. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateEeshTest(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setIsLoading(true);

    try {
      const questionIds = testForm.questionIdsCsv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (questionIds.length === 0) {
        throw new Error('At least one question ID is required');
      }

      const questionRefs = questionIds.map((id) => ({
        questionId: id,
        weight: 1,
        difficulty: 3
      }));

      const payload = {
        type: 'placement' as const,
        title: testForm.title.trim() || 'EESH Placement Test',
        description: testForm.description.trim() || undefined,
        gradeRange: [testForm.gradeRange],
        topics: testForm.topics.split(',').map((t) => t.trim()).filter(Boolean),
        timeLimitSec: Number(testForm.timeLimitSec) || undefined,
        questionRefs,
        isActive: testForm.isActive,
      };

      const res = await apiClient.createTest(payload) as CreateTestResponse;
      setStatus(`Test created successfully: ${res.id}`);

      setTestForm({
        ...testForm,
        title: '',
        description: '',
        topics: '',
        questionIdsCsv: ''
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to create EESH test. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  }

  // Add question creation function
  async function handleCreateQuestion(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setIsLoading(true);

    try {
      if (!questionForm.stem.trim()) {
        throw new Error('Question text is required');
      }

      const payload: any = {
        stem: questionForm.stem.trim(),
        kind: questionForm.kind,
        topics: questionForm.topics.split(',').map((t) => t.trim()).filter(Boolean),
        difficulty: Number(questionForm.difficulty),
        imageUrl: questionForm.imageUrl, // ✅ Include image URL
        grade: questionForm.grade, // ✅ Include grade
        subject: questionForm.subject // ✅ Include subject
      };

      // Handle different question types
      if (questionForm.kind === 'mcq') {
        payload.options = questionForm.options;
        const correctOption = questionForm.options.find(opt => opt.isCorrect);
        if (!correctOption) {
          throw new Error('Please select a correct option for multiple choice question');
        }

        console.log('🔍 MCQ - Correct option:', correctOption);
        console.log('🔍 MCQ - AnswerKey being set to:', correctOption.id);

        payload.answerKey = correctOption.text;
      } else {
        if (!questionForm.answerKey.trim()) {
          throw new Error('Answer key is required for this question type');
        }

        if (questionForm.kind === 'numeric') {
          payload.answerKey = Number(questionForm.answerKey);
        } else {
          payload.answerKey = questionForm.answerKey.trim();
        }
      }

      console.log('🔍 FULL PAYLOAD BEING SENT:', payload);

      const res = await apiClient.createQuestion(payload) as CreateQuestionResponse;
      setStatus(`Question created successfully: ${res.id}`);

      // Reset form - FIXED: Include all required fields
      setQuestionForm({
        stem: '',
        kind: 'mcq',
        options: [{ id: '1', text: '', isCorrect: false, imageUrl: '' }],
        answerKey: '',
        topics: '',
        difficulty: 3,
        imageUrl: '',
        grade: 'EESH',
        subject: 'physics'
      });
    } catch (err: any) {
      console.error('🔍 Question creation error:', err);
      setError(err?.message || 'Failed to create question');
    } finally {
      setIsLoading(false);
    }
  }
  // Add option management functions
  const addOption = () => {
    const newOptions = [...questionForm.options, {
      id: String(questionForm.options.length + 1),
      text: '',
      isCorrect: false,
      imageUrl: '' // ✅ Add imageUrl to new options
    }];
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = questionForm.options.filter((_, i) => i !== index);
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {status && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300">
          {status}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      {/* Create Question Section - ADDED */}
      <section className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create Question</h2>
        <form onSubmit={handleCreateQuestion} className="grid gap-4">
          <textarea
            placeholder="Question text *"
            value={questionForm.stem}
            onChange={(e) => setQuestionForm({ ...questionForm, stem: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            required
          />

          {/* ADD CLOUDINARY UPLOAD COMPONENT */}
          <CloudinaryUpload
            onImageUpload={handleQuestionImageUpload}
            currentImage={questionForm.imageUrl}
          />

          <select
            value={questionForm.kind}
            onChange={(e) => setQuestionForm({ ...questionForm, kind: e.target.value as any })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="numeric">Numeric Answer</option>
            <option value="short_text">Short Text</option>
          </select>

          {questionForm.kind === 'mcq' && (
            <div className="space-y-4">
              <label className="font-medium">Options:</label>
              {questionForm.options.map((option, index) => (
                <div key={option.id} className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  {/* Option Text and Controls */}
                  <div className="flex gap-2 items-start">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1} text`}
                      value={option.text}
                      onChange={(e) => updateOption(index, 'text', e.target.value)}
                      className="border p-2 rounded flex-1"
                    />
                    <label className="flex items-center gap-1 whitespace-nowrap">
                      <input
                        type="radio"
                        name="correct-option"
                        checked={option.isCorrect}
                        onChange={() => {
                          const newOptions = questionForm.options.map((opt, i) => ({
                            ...opt,
                            isCorrect: i === index
                          }));
                          setQuestionForm({ ...questionForm, options: newOptions });
                        }}
                      />
                      <span>Correct</span>
                    </label>
                    {questionForm.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Option Image Upload */}
                  <div className="pl-2 border-l-4 border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Option Image (Optional)
                    </label>
                    <CloudinaryUpload
                      onImageUpload={(url) => handleOptionImageUpload(index, url)}
                      currentImage={option.imageUrl}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
              >
                Add Option
              </button>
            </div>
          )}

          {questionForm.kind !== 'mcq' && (
            <input
              placeholder={questionForm.kind === 'numeric' ? 'Correct number *' : 'Correct answer *'}
              value={questionForm.answerKey}
              onChange={(e) => setQuestionForm({ ...questionForm, answerKey: e.target.value })}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}

          <input
            placeholder="Topics (comma separated) *"
            value={questionForm.topics}
            onChange={(e) => setQuestionForm({ ...questionForm, topics: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="number"
            min={1}
            max={5}
            placeholder="Difficulty (1-5)"
            value={questionForm.difficulty}
            onChange={(e) => setQuestionForm({ ...questionForm, difficulty: Number(e.target.value) })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Question'}
          </button>
        </form>
      </section>


      <section className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create Lesson</h2>
        <form onSubmit={handleCreateLesson} className="grid gap-4">
          <input
            placeholder="Title *"
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            placeholder="Slug (optional)"
            value={lessonForm.slug}
            onChange={(e) => setLessonForm({ ...lessonForm, slug: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={lessonForm.grade}
              onChange={(e) => setLessonForm({ ...lessonForm, grade: e.target.value })}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
              <option value="EESH">EESH</option>
            </select>
            <select
              value={lessonForm.type}
              onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as "video" | 'reading' | 'exercise' })}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="video">Video</option>
              <option value="reading">Reading</option>
              <option value="exercise">Exercise</option>
            </select>
          </div>
          <input
            placeholder="Topics (comma separated)"
            value={lessonForm.topics}
            onChange={(e) => setLessonForm({ ...lessonForm, topics: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            min={1}
            max={5}
            placeholder="Difficulty (1-5)"
            value={lessonForm.difficulty}
            onChange={(e) => setLessonForm({ ...lessonForm, difficulty: Number(e.target.value) })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Content URL (optional)"
            value={lessonForm.contentUrl}
            onChange={(e) => setLessonForm({ ...lessonForm, contentUrl: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={lessonForm.isPublished}
              onChange={(e) => setLessonForm({ ...lessonForm, isPublished: e.target.checked })}
            />
            <span>Publish immediately</span>
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Lesson'}
          </button>
        </form>
      </section>

      <section className="p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create EESH Test</h2>
        <form onSubmit={handleCreateEeshTest} className="grid gap-4">
          <input
            placeholder="Title (optional)"
            value={testForm.title}
            onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Description (optional)"
            value={testForm.description}
            onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={testForm.gradeRange}
              onChange={(e) => setTestForm({ ...testForm, gradeRange: e.target.value })}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
              <option value="EESH">EESH</option>
            </select>
            <input
              type="number"
              placeholder="Time limit (seconds)"
              value={testForm.timeLimitSec}
              onChange={(e) => setTestForm({ ...testForm, timeLimitSec: Number(e.target.value) })}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            placeholder="Topics (comma separated)"
            value={testForm.topics}
            onChange={(e) => setTestForm({ ...testForm, topics: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Question IDs (comma separated Mongo IDs) *"
            value={testForm.questionIdsCsv}
            onChange={(e) => setTestForm({ ...testForm, questionIdsCsv: e.target.value })}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={testForm.isActive}
              onChange={(e) => setTestForm({ ...testForm, isActive: e.target.checked })}
            />
            <span>Active</span>
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create EESH Test'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AdminPage;