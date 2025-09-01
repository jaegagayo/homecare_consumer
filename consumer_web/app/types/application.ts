import { ServiceType, DayOfWeek } from './home';

// 서비스 타입 정의
export interface ServiceTypeOption {
  value: ServiceType;
  label: string;
  description: string;
}

// 일반 서비스 신청서 폼 타입 (백엔드 ConsumerServiceRequest와 일치)
export interface ApplicationForm {
  consumerId?: string; // Optional로 추가
  serviceType: ServiceType;
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
  additionalInformation?: string; // Optional로 변경
}

// 정기 서비스 신청서 폼 타입 (백엔드 CreateRecurringOfferRequest와 일치)
export interface RegularServiceForm {
  caregiverId: string;
  consumerId: string;
  serviceType: ServiceType;
  serviceAddress: string;
  addressType: 'ROAD' | 'JIBUN';
  location: {
    latitude: number;
    longitude: number;
  };
  dayOfWeek: DayOfWeek[]; // DayOfWeek enum 값들
  serviceStartDate: string;
  serviceEndDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
}

// 바우처 정보 타입
export interface VoucherInfo {
  selectedGrade: string;
  voucherLimit: number;
  currentUsage: number;
  selfPayAmount: number;
  isMedicalBenefitRecipient: boolean;
}

// 서비스 타입 목록
export const SERVICE_TYPES: ServiceTypeOption[] = [
  { value: 'VISITING_CARE', label: '방문요양서비스', description: '가정을 방문하여 일상생활 지원' },
  { value: 'DAY_NIGHT_CARE', label: '주야간보호서비스', description: '주간 또는 야간 보호 서비스' },
  { value: 'RESPITE_CARE', label: '단기보호서비스', description: '일시적인 보호 서비스' },
  { value: 'VISITING_BATH', label: '방문목욕서비스', description: '가정 방문 목욕 서비스' },
  { value: 'IN_HOME_SUPPORT', label: '재가노인지원서비스', description: '재가 노인을 위한 종합 지원' },
  { value: 'VISITING_NURSING', label: '방문간호서비스', description: '전문 간호 서비스' },
];

// 시간 슬롯 목록
export const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];
