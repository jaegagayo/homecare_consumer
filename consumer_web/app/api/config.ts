// API 설정 관리
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api', // 백엔드 서버 URL
  TIMEOUT: 10000, // 요청 타임아웃 (10초)
  RETRY_ATTEMPTS: 3, // 재시도 횟수
} as const;

// API 엔드포인트 정의
export const API_ENDPOINTS = {
  CONSUMER: {
    REGISTER: '/consumer/register',
    LOGIN: '/consumer/login',
    PROFILE: '/consumer/my-page',
    UPDATE_PROFILE: '/consumer/my-page',
  },
  HOME: {
    NEXT_SCHEDULE: '/consumer/home/next-schedule',
    NOTIFICATION_REVIEW: '/consumer/home/notification/review',
    NOTIFICATION_RECURRING: '/consumer/home/notification/recurring',
    RECOMMEND_RECURRING: '/consumer/home/recommend/recurring',
    CANCELLED_SCHEDULE: '/consumer/home/notification/reject',
  },
  SERVICE_REQUEST: {
    CREATE: '/consumer/request',
    GET_ALL: '/consumer/request',
    GET_BY_STATUS: '/consumer/request-status',
    GET_BY_ID: '/consumer/{requestId}',
  },
  SCHEDULE: {
    GET_WEEKLY: '/consumer/schedule',
    GET_DETAIL: '/consumer/schedule/{id}',
  },
  RECURRING_OFFER: {
    CREATE: '/consumer/recurring',
    GET_ALL: '/consumer/my-page/recurring',
    GET_DETAIL: '/consumer/my-page/recurring/{recurringId}',
  },
  REVIEW: {
    CREATE: '/consumer/review',
    GET_WRITTEN: '/consumer/my-page/review',
    GET_PENDING: '/consumer/my-page/review/pending',
  },
  BLACKLIST: {
    CREATE: '/consumer/blacklist',
    DELETE: '/consumer/blacklist',
    GET_ALL: '/consumer/my-page/blacklist',
  },
  VOUCHER: {
    GET_GUIDE: '/consumer/request/voucher',
  },
} as const; 