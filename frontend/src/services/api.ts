import axios from 'axios';
import type { Chat, Translation, TranslationStats, ApiResponse, PaginatedResponse } from 'shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatsApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Chat[]>>('/chats');
    return response.data;
  },

  getById: async (chatId: string) => {
    const response = await api.get<ApiResponse<Chat>>(`/chats/${chatId}`);
    return response.data;
  },

  getMessages: async (chatId: string, page = 1, limit = 50) => {
    const response = await api.get<PaginatedResponse<Translation>>(`/chats/${chatId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },

  updateSettings: async (chatId: string, settings: { word_of_hour_enabled?: boolean; is_active?: boolean }) => {
    const response = await api.put<ApiResponse<Chat>>(`/chats/${chatId}/settings`, settings);
    return response.data;
  },
};

export const translationsApi = {
  getAll: async (page = 1, limit = 50) => {
    const response = await api.get<PaginatedResponse<Translation>>('/translations', {
      params: { page, limit },
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse<TranslationStats>>('/translations/stats');
    return response.data;
  },
};

export const configApi = {
  getTelegramStatus: async () => {
    const response = await api.get('/config/telegram-status');
    return response.data;
  },

  updateApiKey: async (apiKey: string) => {
    const response = await api.put('/config/api-keys', { openai_api_key: apiKey });
    return response.data;
  },
};

export default api;
