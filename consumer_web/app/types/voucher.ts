// 바우처 사용 안내 응답 타입
export interface VoucherUsageGuideResponse {
  remainingAmount: number;
  expectedUsageAmount: number;
  expectedCopay: number;
  isHighCopayRate: boolean;
}
