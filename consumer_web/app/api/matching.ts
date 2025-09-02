import { API_CONFIG, API_ENDPOINTS } from './config';
import { Caregiver } from '../types/matching';

// 백엔드 응답 타입 정의
interface BackendCaregiverInfo {
  caregiverId: string;
  name: string;
  gender: string;
  age: number;
  experience: number;
  rating?: number;
  koreanProficiency: string;
  specialCaseExperience?: {
    dementia: boolean;
    bedridden: boolean;
  };
  outingAvailable: boolean;
  rejectionRate?: number;
  selfIntroduction?: string;
}

interface MatchingResponse {
  serviceRequestId: string;
  matchedCaregivers: BackendCaregiverInfo[];
}

// 매칭 후보 조회 API
export const getMatchingCandidates = async (serviceRequestId: string): Promise<Caregiver[]> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.MATCHING.RECOMMEND_LOGGING}?serviceRequestId=${serviceRequestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Matching candidates fetch failed: ${response.status}`);
    }

    const data: MatchingResponse = await response.json();
    
    // 백엔드 응답을 프론트엔드 타입에 맞게 변환
    return data.matchedCaregivers.map((caregiver: BackendCaregiverInfo) => ({
      caregiverId: caregiver.caregiverId,
      name: caregiver.name,
      gender: caregiver.gender.toLowerCase() as 'male' | 'female',
      age: caregiver.age,
      experience: caregiver.experience,
      rating: caregiver.rating || 0,
      koreanProficiency: caregiver.koreanProficiency.toLowerCase() as 'basic' | 'intermediate' | 'advanced' | 'native',
      specialCaseExperience: {
        dementia: caregiver.specialCaseExperience?.dementia || false,
        bedridden: caregiver.specialCaseExperience?.bedridden || false,
      },
      outingAvailable: caregiver.outingAvailable,
      rejectionRate: caregiver.rejectionRate || 0,
      selfIntroduction: caregiver.selfIntroduction || '',
    }));
  } catch (error) {
    console.error('Matching candidates fetch error:', error);
    throw error;
  }
};
