import { useState, useEffect } from "react";
import { Flex, Text, Card } from "@radix-ui/themes";
import { CreditCard } from "lucide-react";
import { VoucherUsageGuideResponse } from "../../types/voucher";
import { getVoucherUsageGuide } from "../../api/voucher";
import { getStoredConsumerId } from "../../api/auth";

interface VoucherInfoDisplayProps {
  estimatedUsage?: number; // 예상 사용 금액 (선택적)
  variant?: 'card' | 'floating'; // 표시 스타일 (기본값: 'card')
}

export default function VoucherInfoDisplay({
  estimatedUsage = 0,
  variant = 'card'
}: VoucherInfoDisplayProps) {
  const [voucherData, setVoucherData] = useState<VoucherUsageGuideResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 바우처 정보 로드
  useEffect(() => {
    const loadVoucherInfo = async () => {
      try {
        const consumerId = getStoredConsumerId();
        if (!consumerId) {
          throw new Error('Consumer ID not found');
        }

        const data = await getVoucherUsageGuide(consumerId);
        setVoucherData(data);
      } catch (error) {
        console.error('바우처 정보 로드 실패:', error);
        // 에러 시 기본값 설정
        setVoucherData({
          remainingAmount: 0,
          expectedUsageAmount: 0,
          expectedCopay: 0,
          isHighCopayRate: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVoucherInfo();
  }, []);

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 바우처 데이터가 없을 때
  if (!voucherData) {
    return null;
  }

  const { remainingAmount } = voucherData;

  // 예상 사용 금액을 뺀 실제 남은 금액
  const finalRemainingAmount = remainingAmount - estimatedUsage;

  // 색상 결정 로직
  const getAmountColor = (amount: number) => {
    if (amount < 0) return "red";
    if (amount < 100000) return "orange";
    return "green";
  };

  const content = (
    <Flex direction="column" gap="2">
      <Flex align="center" gap="2">
        <CreditCard size={16} className="text-blue-600" />
        <Text size="2" weight="medium">바우처 현황</Text>
      </Flex>

      <Flex direction="column" gap="1">
        <Flex justify="between">
          <Text size="1" color="gray">현재 보유 지원금</Text>
          <Text size="1" weight="medium">{remainingAmount.toLocaleString()}원</Text>
        </Flex>

        {estimatedUsage > 0 && (
          <Flex justify="between">
            <Text size="1" color="gray">예상 사용 금액</Text>
            <Text size="1" weight="medium">{estimatedUsage.toLocaleString()}원</Text>
          </Flex>
        )}

        <Flex justify="between">
          <Text size="1" color="gray">남은 금액</Text>
          <Text
            size="1"
            weight="medium"
            color={getAmountColor(finalRemainingAmount)}
          >
            {finalRemainingAmount < 0 ? "0" : finalRemainingAmount.toLocaleString()}원
          </Text>
        </Flex>

        {finalRemainingAmount < 0 && (
          <Flex justify="end">
            <Text size="1" color="red">
              ({Math.abs(finalRemainingAmount).toLocaleString()}원 초과)
            </Text>
          </Flex>
        )}


      </Flex>
    </Flex>
  );

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-24 left-0 right-0 z-50 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4">
      {content}
    </Card>
  );
}
