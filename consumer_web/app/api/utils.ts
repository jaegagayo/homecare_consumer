import { getStoredConsumerId } from './auth';

// HTTP 클라이언트 유틸리티
export class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = 'http://localhost:8080/api';
    this.timeout = 10000;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();

// 공통 유틸리티 함수들
export const apiUtils = {
  // 신청자 ID 가져오기 (에러 처리 포함)
  getConsumerId: (): string => {
    const consumerId = getStoredConsumerId();
    if (!consumerId) {
      throw new Error('Consumer ID not found. Please login first.');
    }
    return consumerId;
  },

  // 인증 상태 확인
  isAuthenticated: (): boolean => {
    return !!getStoredConsumerId();
  },

  // 한글 변환 함수들은 utils/koreanTranslations.ts로 이동

  // 날짜 포맷팅
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // 시간 포맷팅
  formatTime: (timeString: string): string => {
    return timeString.substring(0, 5); // HH:MM 형식으로 변환
  },

  // 날짜와 시간을 함께 포맷팅
  formatDateTime: (dateString: string, timeString: string): string => {
    const date = new Date(`${dateString}T${timeString}`);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // 금액 포맷팅
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  },

  // 에러 메시지 처리
  handleApiError: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return '알 수 없는 오류가 발생했습니다.';
  },
};
