import { API_CONFIG, API_ENDPOINTS } from './config';
import {
  NextScheduleResponse,
  ScheduleWithoutReviewResponse,
  UnreadRecurringOfferResponse,
  RecommendRecurringOfferResponse,
  CancelledScheduleResponse,
} from '../types';

// 다음 일정 조회 API
export const getNextSchedule = async (consumerId: string): Promise<NextScheduleResponse | null> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.HOME.NEXT_SCHEDULE}?consumerId=${consumerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // 다음 일정이 없는 경우
        return null;
      }
      throw new Error(`Next schedule fetch failed: ${response.status}`);
    }

    const data: NextScheduleResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Next schedule fetch error:', error);
    throw error;
  }
};

// 리뷰 미작성 일정 조회 API
export const getSchedulesWithoutReview = async (consumerId: string): Promise<ScheduleWithoutReviewResponse[]> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.HOME.NOTIFICATION_REVIEW}?consumerId=${consumerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Schedules without review fetch failed: ${response.status}`);
    }

    const data: ScheduleWithoutReviewResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Schedules without review fetch error:', error);
    throw error;
  }
};

// 정기 제안 알림 조회 API
export const getUnreadRecurringOffers = async (consumerId: string): Promise<UnreadRecurringOfferResponse[]> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.HOME.NOTIFICATION_RECURRING}?consumerId=${consumerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Unread recurring offers fetch failed: ${response.status}`);
    }

    const data: UnreadRecurringOfferResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Unread recurring offers fetch error:', error);
    throw error;
  }
};

// 정기 제안 추천 조회 API
export const getRecommendRecurringOffers = async (consumerId: string): Promise<RecommendRecurringOfferResponse[]> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.HOME.RECOMMEND_RECURRING}?consumerId=${consumerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Recommend recurring offers fetch failed: ${response.status}`);
    }

    const data: RecommendRecurringOfferResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Recommend recurring offers fetch error:', error);
    throw error;
  }
};

// 취소된 일정 조회 API
export const getCancelledSchedules = async (consumerId: string): Promise<CancelledScheduleResponse[]> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.HOME.CANCELLED_SCHEDULE}?consumerId=${consumerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Cancelled schedules fetch failed: ${response.status}`);
    }

    const data: CancelledScheduleResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Cancelled schedules fetch error:', error);
    throw error;
  }
};

// 통합 홈 데이터 조회 함수 - Promise.allSettled 사용
export const getHomeData = async (consumerId: string) => {
  const results = await Promise.allSettled([
    getNextSchedule(consumerId),
    getSchedulesWithoutReview(consumerId),
    getCancelledSchedules(consumerId),
    getUnreadRecurringOffers(consumerId),
    getRecommendRecurringOffers(consumerId),
  ]);

  const [nextSchedule, reviewRequests, rejections, regularProposals, recommendations] = results;

  return {
    nextSchedule: nextSchedule.status === 'fulfilled' ? nextSchedule.value : null,
    reviewRequests: reviewRequests.status === 'fulfilled' ? reviewRequests.value : [],
    rejections: rejections.status === 'fulfilled' ? rejections.value : [],
    regularProposals: regularProposals.status === 'fulfilled' ? regularProposals.value : [],
    recommendations: recommendations.status === 'fulfilled' ? recommendations.value : [],
  };
};
