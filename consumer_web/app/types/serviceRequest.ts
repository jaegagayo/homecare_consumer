import { ServiceType } from './home';

// 서비스 요청 생성 요청 타입
export interface CreateServiceRequestRequest {
  consumerId: string;
  serviceAddress: string;
  addressType: 'ROAD' | 'JIBUN';
  location: {
    latitude: number;
    longitude: number;
  };
  requestDate: string;
  preferredStartTime: string;
  preferredEndTime: string;
  duration: number;
  serviceType: ServiceType;
  additionalInformation?: string;
}

// 서비스 요청 응답 타입
export interface ServiceRequestResponse {
  id: string;
  consumerId: string;
  serviceAddress: string;
  addressType: 'ROAD' | 'JIBUN';
  location: {
    latitude: number;
    longitude: number;
  };
  requestDate: string;
  preferredStartTime: string;
  preferredEndTime: string;
  duration: number;
  serviceType: ServiceType;
  additionalInformation?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

