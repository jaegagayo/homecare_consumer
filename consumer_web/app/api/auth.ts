import { API_CONFIG, API_ENDPOINTS } from './config';
import {
  UserCreateRequest,
  ConsumerCreateRequest,
  ConsumerSignupRequest,
  ConsumerLoginRequest,
  ConsumerLoginResponse,
} from '../types';

// 신청자 로그인 API
export const loginConsumer = async (email: string, password: string): Promise<ConsumerLoginResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONSUMER.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      } as ConsumerLoginRequest),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data: ConsumerLoginResponse = await response.json();
    
    // consumerId를 localStorage에 저장
    localStorage.setItem('consumerId', data.consumerId);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// 신청자 회원가입 API
export const registerConsumer = async (request: ConsumerSignupRequest): Promise<void> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONSUMER.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// 저장된 신청자 ID 조회
export const getStoredConsumerId = (): string | null => {
  return localStorage.getItem('consumerId');
};

// 로그아웃 (저장된 정보 삭제)
export const logout = (): void => {
  localStorage.removeItem('consumerId');
};

// 인증 상태 확인
export const isAuthenticated = (): boolean => {
  return !!getStoredConsumerId();
}; 