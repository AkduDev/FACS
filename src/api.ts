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
    getAll: () => request<any[]>('/gallery'),
    getById: (id: string) => request<any>(`/gallery/${id}`),
    create: (data: any, file?: File) => {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        return requestFormData<any>('/gallery', 'POST', formData);
      }
      return request<any>('/gallery', { method: 'POST', body: JSON.stringify(data) });
    },
    update: (id: string, data: any, file?: File) => {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        return requestFormData<any>(`/gallery/${id}`, 'PUT', formData);
      }
      return request<any>(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    delete: (id: string) => request<any>(`/gallery/${id}`, { method: 'DELETE' }),
  },

  news: {
    getAll: () => request<any[]>('/news'),
    getById: (id: string) => request<any>(`/news/${id}`),
    create: (data: any, file?: File) => {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        return requestFormData<any>('/news', 'POST', formData);
      }
      return request<any>('/news', { method: 'POST', body: JSON.stringify(data) });
    },
    update: (id: string, data: any, file?: File) => {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        return requestFormData<any>(`/news/${id}`, 'PUT', formData);
      }
      return request<any>(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    delete: (id: string) => request<any>(`/news/${id}`, { method: 'DELETE' }),
  },

  events: {
    getAll: () => request<any[]>('/events'),
    getById: (id: string) => request<any>(`/events/${id}`),
    create: (data: any, file?: File) => {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        return requestFormData<any>('/events', 'POST', formData);
      }
      return request<any>('/events', { method: 'POST', body: JSON.stringify(data) });
    },
    update: (id: string, data: any, file?: File) => {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        return requestFormData<any>(`/events/${id}`, 'PUT', formData);
      }
      return request<any>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    delete: (id: string) => request<any>(`/events/${id}`, { method: 'DELETE' }),
  },

  instructors: {
    getAll: () => request<any[]>('/instructors'),
    getById: (id: string) => request<any>(`/instructors/${id}`),
    create: (data: any, file?: File) => {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        return requestFormData<any>('/instructors', 'POST', formData);
      }
      return request<any>('/instructors', { method: 'POST', body: JSON.stringify(data) });
    },
    update: (id: string, data: any, file?: File) => {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        return requestFormData<any>(`/instructors/${id}`, 'PUT', formData);
      }
      return request<any>(`/instructors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    delete: (id: string) => request<any>(`/instructors/${id}`, { method: 'DELETE' }),
  },

  graduates: {
    getAll: () => request<any[]>('/graduates'),
    getById: (id: string) => request<any>(`/graduates/${id}`),
    search: (q: string) => request<any[]>(`/graduates/search?q=${encodeURIComponent(q)}`),
    verify: (code: string) => request<any>(`/graduates/verify/${encodeURIComponent(code)}`),
    create: (data: any) => request<any>('/graduates', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/graduates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/graduates/${id}`, { method: 'DELETE' }),
  },
};
