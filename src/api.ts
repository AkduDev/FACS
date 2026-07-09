const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('fcas_jwt_token');
}

function setToken(token: string): void {
  localStorage.setItem('fcas_jwt_token', token);
}

function removeToken(): void {
  localStorage.removeItem('fcas_jwt_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

async function requestFormData<T>(url: string, method: string, body: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: {
      ...authHeaders(),
    },
    body,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export interface LoginResponse {
  token: string;
  expiresIn: string;
  user: { id: string; username: string };
}

async function createWithFile<T>(url: string, data: any, file: File): Promise<T> {
  const formData = new FormData();
  formData.append('image', file);
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  return requestFormData<T>(url, 'POST', formData);
}

async function updateWithFile<T>(url: string, data: any, file: File): Promise<T> {
  const formData = new FormData();
  formData.append('image', file);
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  return requestFormData<T>(url, 'PUT', formData);
}

export const api = {
  auth: {
    async login(username: string, password: string): Promise<LoginResponse> {
      const data = await request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setToken(data.token);
      return data;
    },
    logout() {
      removeToken();
    },
    isLoggedIn() {
      return !!getToken();
    },
  },

  gallery: {
    getAll: () => request<{ data: any[]; pagination: any }>('/gallery').then(r => r.data),
    getById: (id: string) => request<any>(`/gallery/${id}`),
    create: (data: any, file?: File) =>
      file ? createWithFile<any>('/gallery', data, file) : request<any>('/gallery', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any, file?: File) =>
      file ? updateWithFile<any>(`/gallery/${id}`, data, file) : request<any>(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/gallery/${id}`, { method: 'DELETE' }),
  },

  news: {
    getAll: () => request<{ data: any[]; pagination: any }>('/news').then(r => r.data),
    getById: (id: string) => request<any>(`/news/${id}`),
    create: (data: any, file?: File) =>
      file ? createWithFile<any>('/news', data, file) : request<any>('/news', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any, file?: File) =>
      file ? updateWithFile<any>(`/news/${id}`, data, file) : request<any>(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/news/${id}`, { method: 'DELETE' }),
  },

  events: {
    getAll: () => request<{ data: any[]; pagination: any }>('/events').then(r => r.data),
    getById: (id: string) => request<any>(`/events/${id}`),
    create: (data: any, file?: File) =>
      file ? createWithFile<any>('/events', data, file) : request<any>('/events', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any, file?: File) =>
      file ? updateWithFile<any>(`/events/${id}`, data, file) : request<any>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/events/${id}`, { method: 'DELETE' }),
  },

  instructors: {
    getAll: () => request<{ data: any[]; pagination: any }>('/instructors').then(r => r.data),
    getById: (id: string) => request<any>(`/instructors/${id}`),
    create: (data: any, file?: File) =>
      file ? createWithFile<any>('/instructors', data, file) : request<any>('/instructors', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any, file?: File) =>
      file ? updateWithFile<any>(`/instructors/${id}`, data, file) : request<any>(`/instructors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/instructors/${id}`, { method: 'DELETE' }),
  },

  graduates: {
    getAll: () => request<{ data: any[]; pagination: any }>('/graduates').then(r => r.data),
    getById: (id: string) => request<any>(`/graduates/${id}`),
    search: (q: string) => request<any[]>(`/graduates/search?q=${encodeURIComponent(q)}`),
    verify: (code: string) => request<any>(`/graduates/verify/${encodeURIComponent(code)}`),
    create: (data: any) => request<any>('/graduates', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/graduates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/graduates/${id}`, { method: 'DELETE' }),
  },
};
