import { API_CONFIG, API_ENDPOINTS } from './config';

// 서비스 요청 생성 요청 타입
export interface CreateServiceRequestRequest {
  consumerId: string;
  serviceAddress: string;
  addressType: 'HOME' | 'CENTER';
  location: {
    latitude: number;
    longitude: number;
  };
  requestDate: string;
  preferredStartTime: string;
  preferredEndTime: string;
  duration: number;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  additionalInformation?: string;
}

// 서비스 요청 응답 타입
export interface ServiceRequestResponse {
  id: string;
  consumerId: string;
  serviceAddress: string;
  addressType: 'HOME' | 'CENTER';
  location: {
    latitude: number;
    longitude: number;
  };
  requestDate: string;
  preferredStartTime: string;
  preferredEndTime: string;
  duration: number;
  serviceType: 'CARE' | 'COMPANION' | 'HOUSEKEEPING';
  additionalInformation?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// 서비스 요청 생성 API
export const createServiceRequest = async (request: CreateServiceRequestRequest): Promise<{ id: string }> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SERVICE_REQUEST.CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Service request creation failed: ${response.status}`);
    }

    const data: { id: string } = await response.json();
    return data;
  } catch (error) {
    console.error('Service request creation error:', error);
    throw error;
  }
};

// 서비스 요청 목록 조회 API
export const getServiceRequests = async (consumerId: string): Promise<ServiceRequestResponse[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SERVICE_REQUEST.GET_ALL}?consumerId=${consumerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Service requests fetch failed: ${response.status}`);
    }

    const data: ServiceRequestResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Service requests fetch error:', error);
    throw error;
  }
};

// 상태별 서비스 요청 조회 API
export const getServiceRequestsByStatus = async (
  consumerId: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
): Promise<ServiceRequestResponse[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SERVICE_REQUEST.GET_BY_STATUS}?consumerId=${consumerId}&status=${status}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Service requests by status fetch failed: ${response.status}`);
    }

    const data: ServiceRequestResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Service requests by status fetch error:', error);
    throw error;
  }
};

// 서비스 요청 상세 조회 API (경로 파라미터 사용)
export const getServiceRequestById = async (requestId: string): Promise<ServiceRequestResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SERVICE_REQUEST.GET_BY_ID.replace('{requestId}', requestId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Service request detail fetch failed: ${response.status}`);
    }

    const data: ServiceRequestResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Service request detail fetch error:', error);
    throw error;
  }
};
