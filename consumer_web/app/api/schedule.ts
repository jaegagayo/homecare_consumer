import { API_CONFIG, API_ENDPOINTS } from './config';
import { getStoredCaregiverId } from './auth';

export interface WorkMatch {
  workMatchId: string;
  caregiverId: string;
  caregiverName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  serviceType: string[];
  address: string;
  status: string;
}

export interface ServiceMatch {
  serviceMatchId: string;
  caregiverId: string;
  caregiverName: string;
  consumerName: string;
  serviceDate: string;
  startTime: string;
  endTime: string;
  workType: string[];
  address: string;
  hourlyWage: number;
  status: string;
  notes: string | null;
}

export interface ScheduleRequest {
  centerId: string;
  year: number;
  month: number;
  day?: number; // 선택적 파라미터
}

export interface ScheduleResponse {
  [key: string]: WorkMatch[];
}

export const getScheduleByDate = async (year: number, month: number, day?: number): Promise<WorkMatch[]> => {
  try {
    const centerId = getStoredCaregiverId();
    if (!centerId) {
      throw new Error('centerId not found in localStorage');
    }

    const params = new URLSearchParams({
      centerId,
      year: year.toString(),
      month: (month + 1).toString(),
    });

    // day 파라미터가 제공된 경우 추가
    if (day !== undefined) {
      params.append('day', day.toString());
    }

    console.log(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCHEDULE.GET_BY_DATE}?${params}`);

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCHEDULE.GET_BY_DATE}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Schedule fetch failed: ${response.status}`);
    }

    const data: WorkMatch[] = await response.json();
    return data;
  } catch (error) {
    console.error('Schedule fetch error:', error);
    throw error;
  }
};

// 특정 일자의 스케줄만 가져오는 함수
export const getScheduleByDay = async (year: number, month: number, day: number): Promise<WorkMatch[]> => {
  return getScheduleByDate(year, month, day);
};

// 특정 요양보호사의 스케줄을 가져오는 함수
export const getCaregiverSchedule = async (caregiverId: string): Promise<ServiceMatch[]> => {
  try {
    const centerId = getStoredCaregiverId();
    if (!centerId) {
      throw new Error('centerId not found in localStorage');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCHEDULE.GET_BY_CAREGIVER.replace('{caregiverId}', caregiverId.toString())}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Caregiver schedule fetch failed: ${response.status}`);
    }

    const data: ServiceMatch[] = await response.json();
    return data;
  } catch (error) {
    console.error('Caregiver schedule fetch error:', error);
    throw error;
  }
}; 