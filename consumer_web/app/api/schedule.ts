import { API_CONFIG, API_ENDPOINTS } from './config';

// 신청자 주간 스케줄 응답 타입
export interface ConsumerScheduleResponse {
  serviceMatchId: string;
  caregiverName: string;
  serviceDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  serviceAddress: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  matchStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

// 신청자 스케줄 상세 응답 타입
export interface ConsumerScheduleDetailResponse {
  serviceMatchId: string;
  caregiverId: string;
  caregiverName: string;
  caregiverPhone: string;
  serviceDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  serviceAddress: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  matchStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  additionalInformation?: string;
  reviewId?: string;
}

// 주간 스케줄 조회 API
export const getConsumerSchedule = async (consumerId: string): Promise<ConsumerScheduleResponse[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCHEDULE.GET_WEEKLY}?consumerId=${consumerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Consumer schedule fetch failed: ${response.status}`);
    }

    const data: ConsumerScheduleResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Consumer schedule fetch error:', error);
    throw error;
  }
};

// 스케줄 상세 조회 API
export const getScheduleDetail = async (scheduleId: string): Promise<ConsumerScheduleDetailResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCHEDULE.GET_DETAIL.replace('{id}', scheduleId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Schedule detail fetch failed: ${response.status}`);
    }

    const data: ConsumerScheduleDetailResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Schedule detail fetch error:', error);
    throw error;
  }
}; 