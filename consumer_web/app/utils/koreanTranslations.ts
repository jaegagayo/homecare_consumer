import { ServiceType } from '../types';

/**
 * 서비스 타입을 한글로 변환
 * @param serviceType - 백엔드 서비스 타입
 * @returns 한글 서비스 타입
 */
export const getServiceTypeKorean = (serviceType: ServiceType): string => {
  switch (serviceType) {
    case 'VISITING_CARE': return '방문요양';
    case 'VISITING_BATH': return '방문목욕';
    case 'VISITING_NURSING': return '방문간호';
    case 'DAY_NIGHT_CARE': return '주야간보호';
    case 'RESPITE_CARE': return '단기보호';
    case 'IN_HOME_SUPPORT': return '재가지원';
    default: return serviceType;
  }
};

/**
 * 매치 상태를 한글로 변환
 * @param status - 백엔드 매치 상태
 * @returns 한글 매치 상태
 */
export const getMatchStatusKorean = (status: string): string => {
  switch (status) {
    case 'PENDING': return '대기중';
    case 'CONFIRMED': return '확정';
    case 'COMPLETED': return '완료';
    case 'CANCELLED': return '취소';
    default: return status;
  }
};

/**
 * 정기 제안 상태를 한글로 변환
 * @param status - 백엔드 정기 제안 상태
 * @returns 한글 정기 제안 상태
 */
export const getRecurringStatusKorean = (status: string): string => {
  switch (status) {
    case 'PENDING': return '승인 대기';
    case 'APPROVED': return '승인 완료';
    case 'REJECTED': return '거절';
    default: return status;
  }
};

/**
 * 서비스 요청 상태를 한글로 변환
 * @param status - 백엔드 서비스 요청 상태
 * @returns 한글 서비스 요청 상태
 */
export const getServiceRequestStatusKorean = (status: string): string => {
  switch (status) {
    case 'PENDING': return '대기중';
    case 'APPROVED': return '승인됨';
    case 'REJECTED': return '거절됨';
    case 'COMPLETED': return '완료';
    default: return status;
  }
};

/**
 * 요일을 한글로 변환
 * @param dayOfWeek - 백엔드 요일
 * @returns 한글 요일
 */
export const getDayOfWeekKorean = (dayOfWeek: string): string => {
  switch (dayOfWeek) {
    case 'MONDAY': return '월요일';
    case 'TUESDAY': return '화요일';
    case 'WEDNESDAY': return '수요일';
    case 'THURSDAY': return '목요일';
    case 'FRIDAY': return '금요일';
    case 'SATURDAY': return '토요일';
    case 'SUNDAY': return '일요일';
    default: return dayOfWeek;
  }
};

/**
 * 매치 상태에 따른 색상 반환
 * @param status - 백엔드 매치 상태
 * @returns 색상 문자열
 */
export const getMatchStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING': return 'yellow';
    case 'CONFIRMED': return 'blue';
    case 'COMPLETED': return 'green';
    case 'CANCELLED': return 'red';
    default: return 'gray';
  }
};

/**
 * 정기 제안 상태에 따른 색상 반환
 * @param status - 백엔드 정기 제안 상태
 * @returns 색상 문자열
 */
export const getRecurringStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING': return 'yellow';
    case 'APPROVED': return 'green';
    case 'REJECTED': return 'red';
    default: return 'gray';
  }
};

/**
 * 서비스 요청 상태에 따른 색상 반환
 * @param status - 백엔드 서비스 요청 상태
 * @returns 색상 문자열
 */
export const getServiceRequestStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING': return 'yellow';
    case 'APPROVED': return 'green';
    case 'REJECTED': return 'red';
    case 'COMPLETED': return 'blue';
    default: return 'gray';
  }
};
