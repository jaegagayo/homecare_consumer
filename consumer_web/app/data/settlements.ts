export interface SettlementRecord {
  id: string;
  caregiverName: string;
  workDate: string;
  workHours: string;
  amount: number;
  status: 'completed' | 'pending' | 'rejected';
  action: string;
}

// 최근 정산 내역 데이터
export const recentSettlementRecords: SettlementRecord[] = [
  {
    id: '1',
    caregiverName: '김영희',
    workDate: '2025-07-25',
    workHours: '8시간',
    amount: 96000,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '2',
    caregiverName: '이철수',
    workDate: '2025-07-26',
    workHours: '6시간',
    amount: 72000,
    status: 'pending',
    action: '승인'
  },
  {
    id: '3',
    caregiverName: '박민수',
    workDate: '2025-07-27',
    workHours: '10시간',
    amount: 120000,
    status: 'rejected',
    action: '재검토'
  },
  {
    id: '4',
    caregiverName: '최동욱',
    workDate: '2025-07-28',
    workHours: '9시간',
    amount: 112500,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '5',
    caregiverName: '정수진',
    workDate: '2025-07-29',
    workHours: '7시간',
    amount: 77000,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '6',
    caregiverName: '한지민',
    workDate: '2025-07-30',
    workHours: '8시간',
    amount: 94400,
    status: 'pending',
    action: '승인'
  },
  {
    id: '7',
    caregiverName: '송민호',
    workDate: '2025-07-31',
    workHours: '6시간',
    amount: 81000,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '8',
    caregiverName: '윤서연',
    workDate: '2025-08-01',
    workHours: '10시간',
    amount: 112000,
    status: 'pending',
    action: '승인'
  },
  {
    id: '9',
    caregiverName: '김태현',
    workDate: '2025-08-02',
    workHours: '8시간',
    amount: 97600,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '10',
    caregiverName: '박소영',
    workDate: '2025-08-03',
    workHours: '9시간',
    amount: 104400,
    status: 'pending',
    action: '승인'
  },
  {
    id: '11',
    caregiverName: '이준호',
    workDate: '2025-08-04',
    workHours: '7시간',
    amount: 89600,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '12',
    caregiverName: '최은지',
    workDate: '2025-08-05',
    workHours: '8시간',
    amount: 96000,
    status: 'rejected',
    action: '재검토'
  },
  {
    id: '13',
    caregiverName: '정현우',
    workDate: '2025-08-06',
    workHours: '6시간',
    amount: 66000,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '14',
    caregiverName: '한미라',
    workDate: '2025-08-07',
    workHours: '10시간',
    amount: 118000,
    status: 'pending',
    action: '승인'
  },
  {
    id: '15',
    caregiverName: '송재현',
    workDate: '2025-08-08',
    workHours: '8시간',
    amount: 105600,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '16',
    caregiverName: '김영희',
    workDate: '2025-08-09',
    workHours: '9시간',
    amount: 108000,
    status: 'pending',
    action: '승인'
  },
  {
    id: '17',
    caregiverName: '박철수',
    workDate: '2025-08-10',
    workHours: '7시간',
    amount: 80500,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '18',
    caregiverName: '이미영',
    workDate: '2025-08-11',
    workHours: '8시간',
    amount: 104000,
    status: 'rejected',
    action: '재검토'
  },
  {
    id: '19',
    caregiverName: '최동욱',
    workDate: '2025-08-12',
    workHours: '6시간',
    amount: 75000,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '20',
    caregiverName: '정수진',
    workDate: '2025-08-13',
    workHours: '10시간',
    amount: 110000,
    status: 'pending',
    action: '승인'
  },
  {
    id: '21',
    caregiverName: '한지민',
    workDate: '2025-08-14',
    workHours: '8시간',
    amount: 94400,
    status: 'completed',
    action: '상세보기'
  },
  {
    id: '22',
    caregiverName: '송민호',
    workDate: '2025-08-15',
    workHours: '9시간',
    amount: 121500,
    status: 'pending',
    action: '승인'
  },
  {
    id: '23',
    caregiverName: '윤서연',
    workDate: '2025-08-16',
    workHours: '7시간',
    amount: 78400,
    status: 'completed',
    action: '상세보기'
  }
];

// 미정산 내역 데이터
export const pendingSettlementRecords: SettlementRecord[] = [
  {
    id: '24',
    caregiverName: '최영수',
    workDate: '2025-07-28',
    workHours: '7시간',
    amount: 84000,
    status: 'pending',
    action: '승인'
  },
  {
    id: '25',
    caregiverName: '정미영',
    workDate: '2025-07-29',
    workHours: '9시간',
    amount: 108000,
    status: 'pending',
    action: '승인'
  },
  {
    id: '26',
    caregiverName: '김태호',
    workDate: '2025-07-30',
    workHours: '8시간',
    amount: 96000,
    status: 'pending',
    action: '승인'
  },
  {
    id: '27',
    caregiverName: '박소영',
    workDate: '2025-08-17',
    workHours: '8시간',
    amount: 92800,
    status: 'pending',
    action: '승인'
  },
  {
    id: '28',
    caregiverName: '이준호',
    workDate: '2025-08-18',
    workHours: '6시간',
    amount: 76800,
    status: 'pending',
    action: '승인'
  },
  {
    id: '29',
    caregiverName: '최은지',
    workDate: '2025-08-19',
    workHours: '10시간',
    amount: 120000,
    status: 'pending',
    action: '승인'
  },
  {
    id: '30',
    caregiverName: '한미라',
    workDate: '2025-08-20',
    workHours: '9시간',
    amount: 106200,
    status: 'pending',
    action: '승인'
  }
];

// 정산 현황 데이터
export const settlementOverviewData = {
  totalAmount: 24500000, // 2,450만원
  previousMonthChange: 12,
  monthlyData: [18000000, 21000000, 19500000, 22000000, 21800000, 24500000] // 단위: 만원
};

// 미정산 현황 데이터
export const pendingSettlementData = {
  pendingCount: 7,
  totalAmount: 1250000, // 125만원
  weeklyData: [2, 1, 3, 0, 2, 1, 3] // 최근 7일 미정산 건수
}; 