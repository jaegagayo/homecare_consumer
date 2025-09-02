import { Flex, Text, Card, Heading } from "@radix-ui/themes";
import { AlertTriangle } from "lucide-react";
import { VoucherUsageGuideResponse } from "../../types/voucher";

interface VoucherUsageGuideProps {
  voucherData: VoucherUsageGuideResponse;
}

export default function VoucherUsageGuide({ voucherData }: VoucherUsageGuideProps) {
  const { remainingAmount, expectedUsageAmount, expectedCopay, isHighCopayRate } = voucherData;

  return (
    <div>
      <Heading size="4" className="mb-4">바우처 사용 예상 (1회 기준)</Heading>
      <Card className="p-4">
        <Flex direction="column" gap="4">
          {/* 남은 지원 금액 */}
          <div>
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">남은 지원 금액</Text>
              <Text 
                size="2" 
                weight="medium"
                color={remainingAmount < 0 ? "red" : remainingAmount < 100000 ? "orange" : "green"}
              >
                {remainingAmount < 0 ? "0" : remainingAmount.toLocaleString()}원
              </Text>
            </Flex>
            {remainingAmount < 0 && (
              <Flex justify="end" className="mt-1">
                <Text size="1" color="red">
                  ({Math.abs(remainingAmount).toLocaleString()}원 초과)
                </Text>
              </Flex>
            )}
          </div>

          <div className="w-full h-px bg-gray-200"></div>

          {/* 예상 사용 금액 */}
          <div>
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">예상 사용 금액</Text>
              <Text size="2" weight="medium">
                {expectedUsageAmount.toLocaleString()}원
              </Text>
            </Flex>
          </div>

          <div className="w-full h-px bg-gray-200"></div>

          {/* 예상 본인부담금 */}
          <div>
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">예상 본인부담금</Text>
              <Text 
                size="2" 
                weight="medium"
                color={isHighCopayRate ? "red" : "green"}
              >
                {expectedCopay.toLocaleString()}원
              </Text>
            </Flex>
            {isHighCopayRate && (
              <Flex justify="between" align="center" className="mt-1">
                <Flex align="center" gap="1">
                  <AlertTriangle size={12} className="text-red-500" />
                  <Text size="1" color="red">
                    지원금 한도 초과
                  </Text>
                </Flex>
              </Flex>
            )}
          </div>
        </Flex>
      </Card>

      {/* 안내 메시지 */}
      {isHighCopayRate ? (
        <Card className="p-4 border-red-200 bg-red-100 mt-4">    
          <Text size="2" color="red">
            예상 본인부담금이 지원금 한도를 초과합니다. 계속 진행하시겠습니까?
          </Text>
        </Card>
      ) : (
        <Card className="p-4 mt-4" style={{ backgroundColor: "var(--accent-3)" }}>
          <Flex align="center" gap="3">
            <div>
              <Text size="2" style={{ color: "var(--accent-9)" }}>
                사용자의 이용 내역을 기반으로 산출된 결과이며, 실제 서비스 신청 시에는 달라질 수 있습니다.
              </Text>
            </div>
          </Flex>
        </Card>
      )}
    </div>
  );
}
