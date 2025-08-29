import { API_CONFIG, API_ENDPOINTS } from './config';

// 블랙리스트 생성 요청 타입
export interface CreateBlacklistRequest {
  caregiverId: string;
  consumerId: string;
}

// 블랙리스트 응답 타입
export interface BlacklistResponse {
  id: string;
  caregiverId: string;
  caregiverName: string;
  consumerId: string;
  createdAt: string;
}

// 블랙리스트 생성 API
export const createBlacklist = async (request: CreateBlacklistRequest): Promise<string> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.BLACKLIST.CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Blacklist creation failed: ${response.status}`);
    }

    const data: string = await response.json();
    return data;
  } catch (error) {
    console.error('Blacklist creation error:', error);
    throw error;
  }
};

// 블랙리스트 해제 API
export const deleteBlacklist = async (caregiverBlacklistId: string): Promise<void> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BLACKLIST.DELETE}?caregiverBlacklistId=${caregiverBlacklistId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Blacklist deletion failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Blacklist deletion error:', error);
    throw error;
  }
};

// 신청자의 블랙리스트 조회 API
export const getBlacklistByConsumer = async (consumerId: string): Promise<BlacklistResponse[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BLACKLIST.GET_ALL}?consumerId=${consumerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Blacklist fetch failed: ${response.status}`);
    }

    const data: BlacklistResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Blacklist fetch error:', error);
    throw error;
  }
};
