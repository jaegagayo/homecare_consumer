// 백엔드 ServiceType enum에 맞춘 타입 정의
export type ServiceType = 
  | 'VISITING_CARE'      // 방문 요양
  | 'VISITING_BATH'      // 방문 목욕
  | 'VISITING_NURSING'   // 방문 간호
  | 'DAY_NIGHT_CARE'     // 주야간 보호
  | 'RESPITE_CARE'       // 단기 보호
  | 'IN_HOME_SUPPORT';   // 재가 요양 지원

// 백엔드 DayOfWeek enum에 맞춘 타입 정의
export type DayOfWeek = 
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

// 다음 일정 조회 응답 타입
export interface NextScheduleResponse {
  serviceMatchId: string;        // 서비스 매칭 ID
  caregiverName: string;
  serviceDate: string;           // LocalDate가 JSON으로 직렬화된 string
  serviceStartTime: string;      // LocalTime이 JSON으로 직렬화된 string
  serviceEndTime: string;        // LocalTime이 JSON으로 직렬화된 string
  serviceAddress: string;
  serviceType: ServiceType;
}

// 리뷰 미작성 일정 조회 응답 타입
export interface ScheduleWithoutReviewResponse {
  serviceMatchId: string;
  caregiverName: string;
  serviceDate: string;           // LocalDate가 JSON으로 직렬화된 string
  serviceStartTime: string;      // LocalTime이 JSON으로 직렬화된 string
  serviceEndTime: string;        // LocalTime이 JSON으로 직렬화된 string
  serviceType: ServiceType;
  // 백엔드에 serviceAddress 필드가 없으므로 제거
}

// 취소된 일정 조회 응답 타입
export interface CancelledScheduleResponse {
  serviceMatchId: string;
  serviceDate: string;           // LocalDate가 JSON으로 직렬화된 string
  startTime: string;             // LocalTime이 JSON으로 직렬화된 string
  endTime: string;               // LocalTime이 JSON으로 직렬화된 string
  caregiverName: string;
}

// 정기 제안 알림 조회 응답 타입
export interface UnreadRecurringOfferResponse {
  recurringOfferId: string;
  caregiverName: string;
  serviceStartDate: string;      // LocalDate가 JSON으로 직렬화된 string
  serviceEndDate: string;        // LocalDate가 JSON으로 직렬화된 string
  serviceStartTime: string;      // LocalTime이 JSON으로 직렬화된 string
  serviceEndTime: string;        // LocalTime이 JSON으로 직렬화된 string
  recurringStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// 정기 제안 추천 조회 응답 타입
export interface RecommendRecurringOfferResponse {
  serviceMatchId: string;
  caregiverId: string;
  serviceDate: string;           // LocalDate가 JSON으로 직렬화된 string
  serviceStartTime: string;      // LocalTime이 JSON으로 직렬화된 string
  serviceEndTime: string;        // LocalTime이 JSON으로 직렬화된 string
  dayOfWeek: DayOfWeek[];       // Set<DayOfWeek>가 JSON으로 직렬화된 배열
}
