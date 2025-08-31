// 정기 제안 생성 요청 타입
export interface CreateRecurringOfferRequest {
  consumerId: string;
  caregiverId: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  serviceAddress: string;
  addressType: 'HOME' | 'CENTER';
  location: {
    latitude: number;
    longitude: number;
  };
  preferredDays: string[]; // ['MONDAY', 'TUESDAY', ...]
  preferredStartTime: string;
  preferredEndTime: string;
  duration: string; // '3h30m' 형식
  additionalInformation?: string;
}

// 정기 제안 응답 타입
export interface RecurringOfferResponse {
  id: string;
  consumerId: string;
  caregiverId: string;
  caregiverName: string;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  serviceAddress: string;
  addressType: 'HOME' | 'CENTER';
  location: {
    latitude: number;
    longitude: number;
  };
  preferredDays: string[];
  preferredStartTime: string;
  preferredEndTime: string;
  duration: string;
  additionalInformation?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

// 정기 제안 상세 응답 타입
export interface RecurringOfferDetailResponse extends RecurringOfferResponse {
  caregiverPhone: string;
  caregiverEmail: string;
  rejectionReason?: string;
}

