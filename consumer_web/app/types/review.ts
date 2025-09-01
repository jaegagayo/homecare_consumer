import { ServiceType } from './home';

// 리뷰 생성 요청 타입
export interface CreateReviewRequest {
  consumerId: string;
  serviceMatchId: string;
  reviewScore: number;
  reviewContent: string;
}

// 백엔드 GetReviewResponse와 일치하는 타입
export interface GetReviewResponse {
  reviewId: string;
  serviceMatchId: string;
  reviewScore: number;
  reviewContent: string;
  createdAt: string;  // LocalDateTime이 JSON으로 직렬화된 string
}

// 신청자 리뷰 응답 타입 (백엔드 ConsumerReviewResponse와 일치)
export interface ConsumerReviewResponse {
  serviceDate: string;        // LocalDate가 JSON으로 직렬화된 string
  caregiverName: string;
  reviewScore: number;        // Double -> number
  reviewContent: string;
}

// 미작성 리뷰 응답 타입
export interface PendingReviewResponse {
  serviceMatchId: string;
  caregiverName: string;
  serviceDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  serviceAddress: string;
  serviceType: ServiceType;
}

