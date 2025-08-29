import { 
  getNextSchedule, 
  getSchedulesWithoutReview, 
  getUnreadRecurringOffers, 
  getRecommendRecurringOffers
} from './home';
import { getStoredConsumerId } from './auth';

// 홈 화면에 필요한 모든 데이터를 한 번에 가져오는 함수
export const getHomeData = async () => {
  const consumerId = getStoredConsumerId();
  
  if (!consumerId) {
    throw new Error('Consumer ID not found. Please login first.');
  }

  try {
    // 모든 API 호출을 병렬로 실행
    const [nextSchedule, schedulesWithoutReview, unreadRecurringOffers, recommendRecurringOffers] = await Promise.all([
      getNextSchedule(consumerId),
      getSchedulesWithoutReview(consumerId),
      getUnreadRecurringOffers(consumerId),
      getRecommendRecurringOffers(consumerId)
    ]);

    return {
      nextSchedule,
      schedulesWithoutReview,
      unreadRecurringOffers,
      recommendRecurringOffers
    };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    throw error;
  }
};

// 홈 화면 알림 개수 계산 함수
export const getNotificationCounts = async () => {
  const consumerId = getStoredConsumerId();
  
  if (!consumerId) {
    return {
      reviewCount: 0,
      recurringCount: 0,
      recommendCount: 0
    };
  }

  try {
    const [schedulesWithoutReview, unreadRecurringOffers, recommendRecurringOffers] = await Promise.all([
      getSchedulesWithoutReview(consumerId),
      getUnreadRecurringOffers(consumerId),
      getRecommendRecurringOffers(consumerId)
    ]);

    return {
      reviewCount: schedulesWithoutReview.length,
      recurringCount: unreadRecurringOffers.length,
      recommendCount: recommendRecurringOffers.length
    };
  } catch (error) {
    console.error('Failed to fetch notification counts:', error);
    return {
      reviewCount: 0,
      recurringCount: 0,
      recommendCount: 0
    };
  }
};

// 다음 일정이 있는지 확인하는 함수
export const hasNextSchedule = async (): Promise<boolean> => {
  const consumerId = getStoredConsumerId();
  
  if (!consumerId) {
    return false;
  }

  try {
    const nextSchedule = await getNextSchedule(consumerId);
    return nextSchedule !== null;
  } catch (error) {
    console.error('Failed to check next schedule:', error);
    return false;
  }
};

// 서비스 타입을 한글로 변환하는 함수
export const getServiceTypeKorean = (serviceType: string): string => {
  switch (serviceType) {
    case 'CARE':
      return '요양';
    case 'COMPANION':
      return '동반';
    case 'HOUSEKEEPING':
      return '가사';
    default:
      return serviceType;
  }
};

// 정기 제안 상태를 한글로 변환하는 함수
export const getRecurringStatusKorean = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return '승인 대기';
    case 'APPROVED':
      return '승인 완료';
    case 'REJECTED':
      return '거절';
    default:
      return status;
  }
};
