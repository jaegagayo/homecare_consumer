// 요양보호 서비스 유형
export const WORK_TYPES = {
  VISITING_CARE: '방문요양',
  DAY_NIGHT_CARE: '주·야간보호',
  RESPITE_CARE: '단기보호',
  VISITING_BATH: '방문목욕',
  IN_HOME_SUPPORT: '재가노인지원',
  VISITING_NURSING: '방문간호'
} as const;

export type WorkType = typeof WORK_TYPES[keyof typeof WORK_TYPES];

// 근무 유형별 색상 매핑
export const WORK_TYPE_COLORS: Record<WorkType, string> = {
  [WORK_TYPES.VISITING_CARE]: 'blue',
  [WORK_TYPES.DAY_NIGHT_CARE]: 'purple',
  [WORK_TYPES.RESPITE_CARE]: 'green',
  [WORK_TYPES.VISITING_BATH]: 'orange',
  [WORK_TYPES.IN_HOME_SUPPORT]: 'yellow',
  [WORK_TYPES.VISITING_NURSING]: 'red'
};

// 근무 유형별 설명
export const WORK_TYPE_DESCRIPTIONS: Record<WorkType, string> = {
  [WORK_TYPES.VISITING_CARE]: '가정에서 일상생활을 영위하고 있는 노인으로서 신체적·정신적 장애로 어려움을 겪고 있는 노인에게 필요한 각종 서비스 제공',
  [WORK_TYPES.DAY_NIGHT_CARE]: '부득이한 사유로 가족의 보호를 받을 수 없는 심신이 허약한 노인과 장애노인을 주간 또는 야간동안 시설에서 보호',
  [WORK_TYPES.RESPITE_CARE]: '부득이한 사유로 가족의 보호를 받을 수 없어 일시적으로 보호가 필요한 심신이 허약한 노인과 장애노인을 시설에 단기간 입소시켜 보호',
  [WORK_TYPES.VISITING_BATH]: '목욕장비를 갖추고 재가노인을 방문하여 목욕을 제공하는 서비스',
  [WORK_TYPES.IN_HOME_SUPPORT]: '재가노인에게 노인생활 및 신상에 관한 상담 제공, 재가노인 및 가족 등 보호자 교육, 각종 편의 등을 제공하는 서비스',
  [WORK_TYPES.VISITING_NURSING]: '수급자의 가정 등을 방문하여 간호, 진료의 보조, 요양에 관한 상담 또는 구강위생 등을 제공하는 서비스'
};

// 근무 유형 목록 (UI에서 사용)
export const WORK_TYPE_LIST: WorkType[] = [
  WORK_TYPES.VISITING_CARE,
  WORK_TYPES.DAY_NIGHT_CARE,
  WORK_TYPES.RESPITE_CARE,
  WORK_TYPES.VISITING_BATH,
  WORK_TYPES.IN_HOME_SUPPORT,
  WORK_TYPES.VISITING_NURSING
]; 