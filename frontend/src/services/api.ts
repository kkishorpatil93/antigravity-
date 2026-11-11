import { supabase } from './supabase';
import {
  FarmerProfile,
  CropRecommendationResult,
  DiseaseAnalysisResult,
  FertilizerAdvisoryResult,
  IrrigationAdvisoryResult,
  AdvisoryRecord,
  ChatConversation,
  ChatMessage,
  ChatApiResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeader();
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    const errorMsg =
      payload.error?.message ||
      payload.error?.code ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return payload.data as T;
}

export const api = {
  // Profile
  profile: {
    get: () => request<FarmerProfile>('/profile'),
    update: (data: Partial<FarmerProfile>) =>
      request<FarmerProfile>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Advisory
  advisory: {
    cropRecommendation: (data: any) =>
      request<AdvisoryRecord>('/advisory/crop-recommendation', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    cropRecommendationById: (id: string) =>
      request<AdvisoryRecord>(`/advisory/crop-recommendation/${id}`),

    diseaseDetection: async (formData: FormData) => {
      const authHeaders = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/advisory/disease-detection`, {
        method: 'POST',
        headers: {
          ...authHeaders,
          // Content-Type is left undefined so browser sets multipart boundary
        },
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || 'Disease detection failed');
      }
      return payload.data as {
        advisory: AdvisoryRecord;
        diseaseAnalysis: any;
        imageUrl: string;
        result: DiseaseAnalysisResult;
      };
    },
    diseaseDetectionById: (id: string) =>
      request<{
        advisory?: AdvisoryRecord;
        imageUrl: string;
        result?: DiseaseAnalysisResult;
        result_data?: DiseaseAnalysisResult;
      }>(`/advisory/disease-detection/${id}`),

    fertilizer: (data: any) =>
      request<AdvisoryRecord>('/advisory/fertilizer', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    irrigation: (data: any) =>
      request<AdvisoryRecord>('/advisory/irrigation', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Assistant Chat
  assistant: {
    chat: (data: {
      conversationId?: string;
      message: string;
      preferredLanguage: 'en' | 'kn';
      farmerContext?: Record<string, any>;
    }) =>
      request<ChatApiResponse>('/assistant/chat', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    conversations: () => request<ChatConversation[]>('/assistant/conversations'),
    createConversation: (title?: string) =>
      request<ChatConversation>('/assistant/conversations', {
        method: 'POST',
        body: JSON.stringify({ title }),
      }),
    messages: (conversationId: string) =>
      request<ChatMessage[]>(`/assistant/conversations/${conversationId}/messages`),
    deleteConversation: (conversationId: string) =>
      request<{ deleted: boolean }>(`/assistant/conversations/${conversationId}`, {
        method: 'DELETE',
      }),
  },

  // History
  history: {
    list: (page = 1, limit = 10, type?: string) => {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(type ? { type } : {}),
      });
      return request<{
        advisories: AdvisoryRecord[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      }>(`/history?${query.toString()}`);
    },
    get: (id: string) => request<AdvisoryRecord>(`/history/${id}`),
    delete: (id: string) =>
      request<{ deleted: boolean }>(`/history/${id}`, {
        method: 'DELETE',
      }),
  },

  // Account
  account: {
    delete: () =>
      request<{ deleted: boolean }>('/account', {
        method: 'DELETE',
      }),
  },
};

