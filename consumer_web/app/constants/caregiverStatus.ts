// 요양보호사 근무 상태
export const CAREGIVER_STATUS = {
  ACTIVE: '활동중',
  INACTIVE: '휴직',
  RESIGNED: '퇴사'
} as const;

export type CaregiverStatus = typeof CAREGIVER_STATUS[keyof typeof CAREGIVER_STATUS];

// 근무 상태별 색상 매핑
export const CAREGIVER_STATUS_COLORS: Record<CaregiverStatus, string> = {
  [CAREGIVER_STATUS.ACTIVE]: 'green',
  [CAREGIVER_STATUS.INACTIVE]: 'yellow',
  [CAREGIVER_STATUS.RESIGNED]: 'red'
};

// 근무 상태별 설명
export const CAREGIVER_STATUS_DESCRIPTIONS: Record<CaregiverStatus, string> = {
  [CAREGIVER_STATUS.ACTIVE]: '현재 근무 중인 요양보호사',
  [CAREGIVER_STATUS.INACTIVE]: '일시적으로 휴직 중인 요양보호사',
  [CAREGIVER_STATUS.RESIGNED]: '퇴사한 요양보호사'
};

// 근무 상태 목록 (UI에서 사용)
export const CAREGIVER_STATUS_LIST: CaregiverStatus[] = [
  CAREGIVER_STATUS.ACTIVE,
  CAREGIVER_STATUS.INACTIVE,
  CAREGIVER_STATUS.RESIGNED
]; 