import { API_CONFIG, API_ENDPOINTS } from './config';
import {
  ConsumerProfileUpdateRequest,
  ConsumerDetailResponse,
} from '../types';

// 신청자 프로필 조회 API
export const getConsumerProfile = async (consumerId: string): Promise<ConsumerDetailResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONSUMER.PROFILE}?consumerId=${consumerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Consumer profile fetch failed: ${response.status}`);
    }

    const data: ConsumerDetailResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Consumer profile fetch error:', error);
    throw error;
  }
};

// 신청자 프로필 수정 API
export const updateConsumerProfile = async (
  consumerId: string,
  request: ConsumerProfileUpdateRequest
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONSUMER.UPDATE_PROFILE}?consumerId=${consumerId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`Consumer profile update failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Consumer profile update error:', error);
    throw error;
  }
};
