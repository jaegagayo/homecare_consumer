export interface Caregiver {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  experience: number;
  rating: number;
  koreanProficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
  specialCaseExperience: {
    dementia: boolean;
    bedridden: boolean;
  };
  outingAvailable: boolean;
  rejectionRate: number;
  selfIntroduction: string;
}

export interface ServiceRequest {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  address: string;
  specialRequests: string;
  status: 'pending' | 'matched' | 'confirmed' | 'completed';
  matchedCaregiver?: Caregiver;
  totalDays?: number;
  requestedDates?: string[];
}

export interface ApplicationForm {
  serviceType: string;
  address: string;
  specialRequests: string;
  estimatedUsage: number;
  duration: number;
  requestedDates: string[];
  startTime: string;
  preferredAreas: string[];
}
