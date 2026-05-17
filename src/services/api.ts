import type { Task } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // 用户相关API
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },
    register: async (username: string, email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      return response.json();
    },
    getCurrentUser: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
  },
  // 任务相关API
  tasks: {
    getTasks: async (token: string, params?: Record<string, string>) => {
      const queryParams = new URLSearchParams(params as Record<string, string>).toString();
      const url = `${API_BASE_URL}/tasks${queryParams ? `?${queryParams}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
    createTask: async (token: string, task: Partial<Task>) => {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      return response.json();
    },
    updateTask: async (token: string, taskId: string, task: Partial<Task>) => {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      return response.json();
    },
    deleteTask: async (token: string, taskId: string) => {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
    toggleTask: async (token: string, taskId: string) => {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
    getStats: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/tasks/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
  },
  ai: {
    breakdown: async (token: string, payload: { title: string; description?: string }) => {
      const response = await fetch(`${API_BASE_URL}/ai/breakdown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    priorityEstimate: async (token: string, payload: { title: string; description?: string; dueDate?: string }) => {
      const response = await fetch(`${API_BASE_URL}/ai/priority-estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    polish: async (token: string, payload: { text: string; style?: string }) => {
      const response = await fetch(`${API_BASE_URL}/ai/polish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    schedule: async (token: string, payload: { rangeDays?: number; workingHours?: string }) => {
      const response = await fetch(`${API_BASE_URL}/ai/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    search: async (token: string, payload: { query: string }) => {
      const response = await fetch(`${API_BASE_URL}/ai/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
  },
};