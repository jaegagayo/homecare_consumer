// API 설정 관리
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api', // 백엔드 서버 URL
  TIMEOUT: 10000, // 요청 타임아웃 (10초)
  RETRY_ATTEMPTS: 3, // 재시도 횟수
} as const;

// API 엔드포인트 정의
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/center/login',
  },
  SCHEDULE: {
    GET_BY_DATE: '/center/schedule/date',
    GET_BY_CAREGIVER: '/center/schedule/{caregiverId}',
  },
  CAREGIVER: {
    GET_ALL: '/center/{centerId}/caregiver',
    GET_PROFILE: '/center/profile',
    GET_CERTIFICATION: '/center/{caregiverId}/certification',
  },
  ASSIGN: {
    GET_ALL: '/center/{centerId}/assign',
  },
} as const; 