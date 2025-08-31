// 리뷰 생성 요청 타입
export interface CreateReviewRequest {
  consumerId: string;
  serviceMatchId: string;
  reviewScore: number;
  reviewContent: string;
}

// 리뷰 응답 타입
export interface ReviewResponse {
  id: string;
  consumerId: string;
  serviceMatchId: string;
  reviewScore: number;
  reviewContent: string;
  createdAt: string;
  updatedAt: string;
}

// 신청자 리뷰 응답 타입
export interface ConsumerReviewResponse {
  id: string;
  serviceMatchId: string;
  caregiverName: string;
  serviceDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  serviceAddress: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  reviewScore: number;
  reviewContent: string;
  createdAt: string;
}

// 미작성 리뷰 응답 타입
export interface PendingReviewResponse {
  serviceMatchId: string;
  caregiverName: string;
  serviceDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  serviceAddress: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
}

