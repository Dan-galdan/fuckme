const API_BASE_URL = 'http://localhost:4000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Don't set Content-Type if it's explicitly set to undefined
    const headers: Record<string, string> = {};
    const contentType = (options.headers as any)?.['Content-Type'];
    if (contentType !== undefined) {
      // Content-Type is explicitly set, don't override it
    } else {
      // Content-Type is not set, use default
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async registerInit(data: any) {
    return this.request('/auth/register-init', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async completeRegistration(data: any) {
    return this.request('/auth/complete-registration', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: any) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    // Use a custom request method that doesn't set Content-Type
    const url = `${this.baseUrl}/auth/refresh`;

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include', // Include cookies for authentication
      // No Content-Type header - let browser handle it
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Test endpoints
  async getPlacementTest(grade?: string) {
    const params = grade ? `?grade=${grade}` : '';
    return this.request(`/tests/placement${params}`);
  }

  // FIXED: Added TypeScript types
  async getTestById(testId: string) {
    return this.request(`/tests/${testId}`);
  }

  // FIXED: Added TypeScript types
  async submitTestAttempt(data: any) {
    return this.request('/tests/attempt', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRetestSchedule() {
    return this.request('/tests/retest/schedule');
  }

  // Lesson endpoints
  async getLessons(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/lessons${queryString}`);
  }

  async getLessonsByGrade(grade: string) {
    return this.request(`/lessons?grade=${grade}`);
  }

  async getLesson(id: string) {
    return this.request(`/lessons/${id}`);
  }

  // Recommendation endpoints
  async getRecommendations() {
    console.log('🌐 API: Fetching recommendations from /recommendations');
    const result = await this.request('/recommendations') as any;
    console.log('🌐 API: Received recommendations response:', {
      hasLessons: !!result.lessons,
      lessonCount: result.lessons?.length || 0,
      lessons: result.lessons?.map((l: any) => ({ id: l.id, title: l.title })) || []
    });
    return result;
  }

  async recomputeRecommendations(userId?: string) {
    return this.request('/recommendations/recompute', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Payment endpoints
  async createPaymentSession(data: any) {
    return this.request('/payments/session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentStatus(sessionId: string) {
    return this.request(`/payments/status/${sessionId}`);
  }

  // Admin endpoints
  async createLesson(data: any) {
    return this.request('/admin/lessons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createQuestion(data: any) {
    return this.request('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createTest(data: any) {
    return this.request('/admin/tests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTests() {
    return this.request('/admin/tests');
  }

  async getAdminStats() {
    return this.request('/admin/stats/overview');
  }
}

export const apiClient = new ApiClient();
export default apiClient;