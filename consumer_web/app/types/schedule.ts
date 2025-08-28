export interface Schedule {
  id: string;
  date: string;
  time: string;
  clientName: string;
  address: string;
  serviceType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number;
  hourlyRate: number;
  isRegular?: boolean;
  regularSequence?: { current: number; total: number };
}
