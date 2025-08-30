// 다음 일정 조회 응답 타입
export interface NextScheduleResponse {
  caregiverName: string;
  serviceDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  serviceAddress: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
}

// 리뷰 미작성 일정 조회 응답 타입
export interface ScheduleWithoutReviewResponse {
  serviceMatchId: string;
  caregiverName: string;
  serviceDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  serviceAddress: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
}

// 정기 제안 알림 조회 응답 타입
export interface UnreadRecurringOfferResponse {
  recurringOfferId: string;
  caregiverName: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

// 정기 제안 추천 조회 응답 타입
export interface RecommendRecurringOfferResponse {
  recurringOfferId: string;
  caregiverName: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}
