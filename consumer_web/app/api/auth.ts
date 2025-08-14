import { API_CONFIG, API_ENDPOINTS } from './config';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  caregiverId: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      } as LoginRequest),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    
    // caregiverId를 localStorage에 저장
    localStorage.setItem('caregiverId', data.caregiverId);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getStoredCaregiverId = (): string | null => {
  return localStorage.getItem('caregiverId');
};

export const clearStoredCaregiverId = (): void => {
  localStorage.removeItem('caregiverId');
}; 