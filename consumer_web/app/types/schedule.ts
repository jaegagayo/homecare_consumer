export interface Schedule {
  id: string;
  date: string;
  time: string;
  clientName: string;
  caregiverName: string;
  address: string;
  serviceType: string;
  status: 'pending_approval' | 'upcoming' | 'completed' | 'cancelled';
  duration: number;
  hourlyRate: number;
  isRegular?: boolean;
  regularSequence?: { current: number; total: number };
}
