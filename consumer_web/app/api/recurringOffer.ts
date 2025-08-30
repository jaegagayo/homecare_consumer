import { API_CONFIG, API_ENDPOINTS } from './config';
import {
  CreateRecurringOfferRequest,
  RecurringOfferResponse,
  RecurringOfferDetailResponse,
} from '../types';

// 정기 제안 생성 API
export const createRecurringOffer = async (request: CreateRecurringOfferRequest): Promise<void> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECURRING_OFFER.CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Recurring offer creation failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Recurring offer creation error:', error);
    throw error;
  }
};

// 신청자의 정기 제안 목록 조회 API
export const getRecurringOffersByConsumer = async (consumerId: string): Promise<RecurringOfferResponse[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECURRING_OFFER.GET_ALL}?consumerId=${consumerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Recurring offers fetch failed: ${response.status}`);
    }

    const data: RecurringOfferResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Recurring offers fetch error:', error);
    throw error;
  }
};

// 정기 제안 상세 조회 API
export const getRecurringOfferDetail = async (recurringId: string): Promise<RecurringOfferDetailResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.RECURRING_OFFER.GET_DETAIL.replace('{recurringId}', recurringId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Recurring offer detail fetch failed: ${response.status}`);
    }

    const data: RecurringOfferDetailResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Recurring offer detail fetch error:', error);
    throw error;
  }
};
