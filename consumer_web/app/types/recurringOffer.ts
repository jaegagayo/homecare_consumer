// 정기 제안 생성 요청 타입 (백엔드 CreateRecurringOfferRequest와 일치)
export interface CreateRecurringOfferRequest {
  caregiverId: string;
  consumerId: string;
  serviceAddress: string;
  addressType: 'ROAD' | 'JIBUN';
  location: {
    latitude: number;
    longitude: number;
  };
  dayOfWeek: string[]; // ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  serviceStartDate: string; // YYYY-MM-DD 형식
  serviceEndDate: string; // YYYY-MM-DD 형식
  serviceStartTime: string; // HH:mm:ss 형식
  serviceEndTime: string; // HH:mm:ss 형식
  serviceType: 'VISITING_CARE' | 'VISITING_BATH' | 'VISITING_NURSING' | 'DAY_NIGHT_CARE' | 'RESPITE_CARE' | 'IN_HOME_SUPPORT';
}

// 정기 제안 응답 타입 (백엔드 GetRecurringOfferResponse와 일치)
export interface RecurringOfferResponse {
  id: string;
  consumerId: string;
  caregiverId: string;
  caregiverName: string;
  serviceType: 'VISITING_CARE' | 'VISITING_BATH' | 'VISITING_NURSING' | 'DAY_NIGHT_CARE' | 'RESPITE_CARE' | 'IN_HOME_SUPPORT';
  serviceAddress: string;
  addressType: 'ROAD' | 'JIBUN';
  location: {
    latitude: number;
    longitude: number;
  };
  dayOfWeek: string[];
  serviceStartDate: string;
  serviceEndDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

// 정기 제안 상세 응답 타입 (백엔드 GetRecurringOfferDetailResponse와 일치)
export interface RecurringOfferDetailResponse extends RecurringOfferResponse {
  caregiverPhone: string;
  caregiverEmail: string;
  rejectionReason?: string;
}

