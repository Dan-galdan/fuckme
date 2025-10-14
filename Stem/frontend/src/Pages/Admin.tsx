import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/auth';

function AdminPage() {
  const { user } = useAuthStore();
  const isAdmin = !!user?.roles?.includes('admin');

  const [lessonForm, setLessonForm] = useState({
    title: '',
    slug: '',
    grade: 'EESH',
    topics: '',
    difficulty: 3,
    type: 'reading',
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

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin) {
    return <div className="p-4">Access denied. Admins only.</div>;
  }

  async function handleCreateLesson(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    try {
      const payload: any = {
        title: lessonForm.title.trim(),
        slug: lessonForm.slug.trim() || lessonForm.title.trim().toLowerCase().replace(/\s+/g, '-'),
        grade: lessonForm.grade,
        topics: lessonForm.topics.split(',').map((t) => t.trim()).filter(Boolean),
        difficulty: Number(lessonForm.difficulty),
        type: lessonForm.type,
        contentUrl: lessonForm.contentUrl.trim() || undefined,
        isPublished: lessonForm.isPublished,
      };
      const res = await apiClient.createLesson(payload) as any;
      setStatus(`Lesson created: ${res.id}`);
      setLessonForm({ ...lessonForm, title: '', slug: '', topics: '', contentUrl: '' });
    } catch (err: any) {
      setError(err?.message || 'Failed to create lesson');
    }
  }

  async function handleCreateEeshTest(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    try {
      const questionIds = testForm.questionIdsCsv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const questionRefs = questionIds.map((id) => ({ questionId: id, weight: 1 }));
      const payload: any = {
        type: 'placement',
        title: testForm.title.trim() || 'EESH Placement Test',
        description: testForm.description.trim() || undefined,
        gradeRange: [testForm.gradeRange],
        topics: testForm.topics.split(',').map((t) => t.trim()).filter(Boolean),
        timeLimitSec: Number(testForm.timeLimitSec) || undefined,
        questionRefs,
        isActive: testForm.isActive,
      };
      const res = await apiClient.createTest(payload) as any;
      setStatus(`Test created: ${res.id}`);
      setTestForm({ ...testForm, title: '', description: '', topics: '', questionIdsCsv: '' });
    } catch (err: any) {
      setError(err?.message || 'Failed to create EESH test');
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {status && <div className="mb-3 text-green-600">{status}</div>}
      {error && <div className="mb-3 text-red-600">{error}</div>}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create Lesson</h2>
        <form onSubmit={handleCreateLesson} className="grid gap-3">
          <input placeholder="Title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Slug (optional)" value={lessonForm.slug} onChange={(e) => setLessonForm({ ...lessonForm, slug: e.target.value })} className="border p-2 rounded" />
          <div className="grid grid-cols-2 gap-3">
            <select value={lessonForm.grade} onChange={(e) => setLessonForm({ ...lessonForm, grade: e.target.value })} className="border p-2 rounded">
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="EESH">EESH</option>
            </select>
            <select value={lessonForm.type} onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })} className="border p-2 rounded">
              <option value="video">video</option>
              <option value="reading">reading</option>
              <option value="exercise">exercise</option>
            </select>
          </div>
          <input placeholder="Topics (comma separated)" value={lessonForm.topics} onChange={(e) => setLessonForm({ ...lessonForm, topics: e.target.value })} className="border p-2 rounded" />
          <input type="number" min={1} max={5} placeholder="Difficulty (1-5)" value={lessonForm.difficulty} onChange={(e) => setLessonForm({ ...lessonForm, difficulty: Number(e.target.value) })} className="border p-2 rounded" />
          <input placeholder="Content URL (optional)" value={lessonForm.contentUrl} onChange={(e) => setLessonForm({ ...lessonForm, contentUrl: e.target.value })} className="border p-2 rounded" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={lessonForm.isPublished} onChange={(e) => setLessonForm({ ...lessonForm, isPublished: e.target.checked })} />
            <span>Publish</span>
          </label>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Lesson</button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Create EESH Test</h2>
        <form onSubmit={handleCreateEeshTest} className="grid gap-3">
          <input placeholder="Title (optional)" value={testForm.title} onChange={(e) => setTestForm({ ...testForm, title: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Description (optional)" value={testForm.description} onChange={(e) => setTestForm({ ...testForm, description: e.target.value })} className="border p-2 rounded" />
          <div className="grid grid-cols-2 gap-3">
            <select value={testForm.gradeRange} onChange={(e) => setTestForm({ ...testForm, gradeRange: e.target.value })} className="border p-2 rounded">
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="EESH">EESH</option>
            </select>
            <input type="number" placeholder="Time limit (sec)" value={testForm.timeLimitSec} onChange={(e) => setTestForm({ ...testForm, timeLimitSec: Number(e.target.value) })} className="border p-2 rounded" />
          </div>
          <input placeholder="Topics (comma separated)" value={testForm.topics} onChange={(e) => setTestForm({ ...testForm, topics: e.target.value })} className="border p-2 rounded" />
          <textarea placeholder="Question IDs (comma separated Mongo IDs)" value={testForm.questionIdsCsv} onChange={(e) => setTestForm({ ...testForm, questionIdsCsv: e.target.value })} className="border p-2 rounded h-28" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={testForm.isActive} onChange={(e) => setTestForm({ ...testForm, isActive: e.target.checked })} />
            <span>Active</span>
          </label>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create EESH Test</button>
        </form>
      </section>
    </div>
  );
}

export default AdminPage;


