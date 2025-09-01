import { ServiceType } from './home';

export interface Schedule {
  id: string;
  date: string;
  time: string;
  clientName: string;
  address: string;
  serviceType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number;
  hourlyRate: number;
  isRegular?: boolean;
  regularSequence?: { current: number; total: number };
}

// 신청자 주간 스케줄 응답 타입
export interface ConsumerScheduleResponse {
  serviceMatchId: string;
  caregiverName: string;
  serviceDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  serviceAddress: string;
  serviceType: ServiceType;
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
  serviceType: ServiceType;
  matchStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  additionalInformation?: string;
  reviewId?: string;
}
