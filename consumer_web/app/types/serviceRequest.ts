// 서비스 요청 생성 요청 타입
export interface CreateServiceRequestRequest {
  consumerId: string;
  serviceAddress: string;
  addressType: 'HOME' | 'CENTER';
  location: {
    latitude: number;
    longitude: number;
  };
  requestDate: string;
  preferredStartTime: string;
  preferredEndTime: string;
  duration: number;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  additionalInformation?: string;
}

// 서비스 요청 응답 타입
export interface ServiceRequestResponse {
  id: string;
  consumerId: string;
  serviceAddress: string;
  addressType: 'HOME' | 'CENTER';
  location: {
    latitude: number;
    longitude: number;
  };
  requestDate: string;
  preferredStartTime: string;
  preferredEndTime: string;
  duration: number;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  additionalInformation?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

