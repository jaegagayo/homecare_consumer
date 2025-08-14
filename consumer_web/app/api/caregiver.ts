import { API_CONFIG, API_ENDPOINTS } from './config';
import { getStoredCaregiverId } from './auth';

export interface CaregiverApi {
  caregiverId: string;
  name: string;
  phone: string;
  serviceTypes: string[];
  status: string;
}

// 인사카드 조회를 위한 API 응답 타입
export interface CaregiverProfileApi {
  caregiverName: string;
  email: string;
  birthDate: string;
  phone: string;
  address: string;
  status: string;
  serviceTypes: string[];
}

// 자격증 정보 조회를 위한 API 응답 타입
export interface CaregiverCertificationApi {
  certificationId: string;
  certificationNumber: string;
  certificationDate: string;
  trainStatus: boolean;
}

// 매칭 정보 조회를 위한 API 응답 타입
export interface AssignApi {
  consumerName: string;
  caregiverName: string;
  serviceDate: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  status: string;
}

export const getCaregivers = async (): Promise<CaregiverApi[]> => {
  try {
    const centerId = getStoredCaregiverId();
    if (!centerId) {
      throw new Error('centerId not found in localStorage');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAREGIVER.GET_ALL.replace('{centerId}', centerId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Caregiver fetch failed: ${response.status}`);
    }

    const data: CaregiverApi[] = await response.json();
    return data;
  } catch (error) {
    console.error('Caregiver fetch error:', error);
    throw error;
  }
};

// 인사카드 조회 API 함수
export const getCaregiverProfile = async (caregiverId: string): Promise<CaregiverProfileApi> => {
  try {
    const params = new URLSearchParams({
      caregiverId: caregiverId,
    });

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAREGIVER.GET_PROFILE}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Caregiver profile fetch failed: ${response.status}`);
    }

    const data: CaregiverProfileApi = await response.json();
    return data;
  } catch (error) {
    console.error('Caregiver profile fetch error:', error);
    throw error;
  }
};

// 자격증 정보 조회 API 함수
export const getCaregiverCertification = async (caregiverId: string): Promise<CaregiverCertificationApi> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CAREGIVER.GET_CERTIFICATION.replace('{caregiverId}', caregiverId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Caregiver certification fetch failed: ${response.status}`);
    }

    const data: CaregiverCertificationApi = await response.json();
    return data;
  } catch (error) {
    console.error('Caregiver certification fetch error:', error);
    throw error;
  }
};

// 매칭 정보 조회 API 함수
export const getAssignments = async (): Promise<AssignApi[]> => {
  try {
    const centerId = getStoredCaregiverId();
    if (!centerId) {
      throw new Error('centerId not found in localStorage');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ASSIGN.GET_ALL.replace('{centerId}', centerId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Assignments fetch failed: ${response.status}`);
    }

    const data: AssignApi[] = await response.json();
    return data;
  } catch (error) {
    console.error('Assignments fetch error:', error);
    throw error;
  }
}; 