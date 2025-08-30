import { API_CONFIG, API_ENDPOINTS } from './config';
import {
  CreateReviewRequest,
  ReviewResponse,
  ConsumerReviewResponse,
  PendingReviewResponse,
} from '../types';

// 리뷰 생성 API
export const createReview = async (request: CreateReviewRequest): Promise<string> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.REVIEW.CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Review creation failed: ${response.status}`);
    }

    const data: string = await response.json();
    return data;
  } catch (error) {
    console.error('Review creation error:', error);
    throw error;
  }
};

// 신청자가 작성한 리뷰 조회 API
export const getWrittenReviews = async (consumerId: string): Promise<ConsumerReviewResponse[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REVIEW.GET_WRITTEN}?consumerId=${consumerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Written reviews fetch failed: ${response.status}`);
    }

    const data: ConsumerReviewResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Written reviews fetch error:', error);
    throw error;
  }
};

// 신청자가 작성해야 할 리뷰 조회 API
export const getPendingReviews = async (consumerId: string): Promise<PendingReviewResponse[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REVIEW.GET_PENDING}?consumerId=${consumerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pending reviews fetch failed: ${response.status}`);
    }

    const data: PendingReviewResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Pending reviews fetch error:', error);
    throw error;
  }
};
