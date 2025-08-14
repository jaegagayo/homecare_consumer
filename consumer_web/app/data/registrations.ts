export interface RegistrationRecord {
  id: string;
  caregiverName: string;
  phone: string;
  requestType: 'registration' | 'deletion';
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

// 샘플 등록/말소 데이터
export const sampleRegistrationRecords: RegistrationRecord[] = [
  {
    id: '1',
    caregiverName: '김영희',
    phone: '010-1234-5678',
    requestType: 'registration',
    requestDate: '2025-07-25',
    status: 'approved',
    reason: '신규 등록'
  },
  {
    id: '2',
    caregiverName: '이철수',
    phone: '010-2345-6789',
    requestType: 'deletion',
    requestDate: '2025-07-26',
    status: 'pending',
    reason: '개인 사정으로 인한 말소'
  },
  {
    id: '3',
    caregiverName: '박민수',
    phone: '010-3456-7890',
    requestType: 'registration',
    requestDate: '2025-07-27',
    status: 'rejected',
    reason: '신규 등록'
  },
  {
    id: '4',
    caregiverName: '최영수',
    phone: '010-4567-8901',
    requestType: 'registration',
    requestDate: '2025-07-28',
    status: 'pending',
    reason: '신규 등록'
  },
  {
    id: '5',
    caregiverName: '정미영',
    phone: '010-5678-9012',
    requestType: 'deletion',
    requestDate: '2025-07-29',
    status: 'approved',
    reason: '건강상의 이유로 인한 말소'
  },
  {
    id: '6',
    caregiverName: '김태호',
    phone: '010-6789-0123',
    requestType: 'registration',
    requestDate: '2025-07-30',
    status: 'pending',
    reason: '신규 등록'
  },
  {
    id: '7',
    caregiverName: '이수진',
    phone: '010-7890-1234',
    requestType: 'deletion',
    requestDate: '2025-07-31',
    status: 'rejected',
    reason: '개인 사정으로 인한 말소'
  },
  {
    id: '8',
    caregiverName: '박준호',
    phone: '010-8901-2345',
    requestType: 'registration',
    requestDate: '2025-08-01',
    status: 'approved',
    reason: '신규 등록'
  },
  {
    id: '9',
    caregiverName: '최지영',
    phone: '010-9012-3456',
    requestType: 'registration',
    requestDate: '2025-08-02',
    status: 'pending',
    reason: '신규 등록'
  },
  {
    id: '10',
    caregiverName: '정현우',
    phone: '010-0123-4567',
    requestType: 'deletion',
    requestDate: '2025-08-03',
    status: 'pending',
    reason: '이직으로 인한 말소'
  }
]; 