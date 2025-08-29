import { API_CONFIG, API_ENDPOINTS } from './config';

// 바우처 사용 안내 응답 타입
export interface VoucherUsageGuideResponse {
  remainingAmount: number;
  expectedUsageAmount: number;
  expectedCopay: number;
  isHighCopayRate: boolean;
}

// 바우처 사용 안내 조회 API
export const getVoucherUsageGuide = async (consumerId: string): Promise<VoucherUsageGuideResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VOUCHER.GET_GUIDE}?consumerId=${consumerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Voucher usage guide fetch failed: ${response.status}`);
    }

    const data: VoucherUsageGuideResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Voucher usage guide fetch error:', error);
    throw error;
  }
};
