/**
 * EcoVision AI - Frontend API Service Client
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = {
  // 1. Health & Model Telemetry
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return res.json();
  },

  async getModelInfo() {
    const res = await fetch(`${API_BASE_URL}/api/model-info`);
    if (!res.ok) throw new Error(`Failed to fetch model info: ${res.statusText}`);
    return res.json();
  },

  // 2. Classify Uploaded Waste Image
  async classifyImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/api/classify`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Classification failed');
    }
    return res.json();
  },

  // 3. Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE_URL}/api/analytics`);
    if (!res.ok) throw new Error(`Failed to fetch analytics: ${res.statusText}`);
    return res.json();
  },

  // 4. History
  async getHistory({ category = '', search = '', limit = 50, offset = 0 } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    params.append('limit', limit);
    params.append('offset', offset);

    const res = await fetch(`${API_BASE_URL}/api/history?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch history: ${res.statusText}`);
    return res.json();
  },

  async deleteHistoryItem(id) {
    const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete record: ${res.statusText}`);
    return res.json();
  },

  // 5. Educational Categories
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
    return res.json();
  },
};
