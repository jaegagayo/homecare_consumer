import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Container,
  Flex,
  Text,
  Button,
  Heading,
  Card
} from "@radix-ui/themes";
import {
  AlertTriangle
} from "lucide-react";

interface VoucherInfo {
  selectedGrade: string;
  voucherLimit: number;
  currentUsage: number;
  selfPayAmount: number;
  isMedicalBenefitRecipient: boolean;
}

export default function VoucherPreviewPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 바우처 정보 (실제로는 프로필에서 가져와야 함)
  const [voucherInfo] = useState<VoucherInfo>({
    selectedGrade: '3등급',
    voucherLimit: 1295400,
    currentUsage: 1270000, // 사용량을 높여서 남은 금액이 적게 설정
    selfPayAmount: 194310,
    isMedicalBenefitRecipient: false
  });

  // 3시간 기준 계산
  const baseHourlyRate = 15000; // 기본 시급
  const threeHourCost = baseHourlyRate * 3; // 3시간 기준 비용 (45,000원)
  
  // 바우처 사용량 계산 (3시간 서비스 비용의 85%를 바우처에서 차감)
  const voucherUsageForThreeHours = threeHourCost * 0.85; // 38,250원
  const totalVoucherUsage = voucherInfo.currentUsage + voucherUsageForThreeHours;
  
  // 현재 남은 바우처 금액
  const currentRemainingAmount = voucherInfo.voucherLimit - voucherInfo.currentUsage;
  
  // 3시간 서비스 신청 후 남은 바우처 금액
  const remainingAmount = voucherInfo.voucherLimit - totalVoucherUsage;
  
  // 본인부담금 계산
  let threeHourSelfPay = threeHourCost * 0.15; // 기본 본인부담금 (6,750원)
  
  // 바우처가 부족한 경우 추가 본인부담금 발생
  if (remainingAmount < 0) {
    threeHourSelfPay += Math.abs(remainingAmount); // 부족한 바우처 금액만큼 추가 부담
  }
  
  const isOverLegalRate = threeHourSelfPay > (threeHourCost * 0.15); // 15% 법정 부담률 초과 여부

  const handleContinue = () => {
    setIsLoading(true);
    // 신청 폼으로 이동
    navigate('/main/application-form');
  };

  const handleCancel = () => {
    // 이전 페이지로 돌아가기
    navigate(-1);
  };

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 헤더 */}
        <div>
          <Heading size="5">바우처 사용 안내</Heading>
          <Text size="3" color="gray">
            예상되는 본인부담금을 확인해주세요
          </Text>
        </div>

        {/* 바우처 현황 섹션 */}
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
                    color={currentRemainingAmount < 0 ? "red" : currentRemainingAmount < 100000 ? "orange" : "green"}
                  >
                    {currentRemainingAmount.toLocaleString()}원
                  </Text>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 3시간 서비스 비용 및 바우처 소진 금액 */}
              <div>
                <Flex justify="between" align="center" className="mb-2">
                  <Text size="2" weight="medium">3시간 서비스 비용</Text>
                  <Text size="2" weight="medium">
                    {threeHourCost.toLocaleString()}원
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">3시간 신청 시 예상 소진 금액</Text>
                  <Text size="2" weight="medium">
                    {voucherUsageForThreeHours.toLocaleString()}원
                  </Text>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 소진 후 남은 지원금 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">소진 후 남은 지원금</Text>
                  <Text 
                    size="2" 
                    weight="medium"
                    color={remainingAmount < 0 ? "red" : remainingAmount < 100000 ? "orange" : "green"}
                  >
                    {remainingAmount.toLocaleString()}원
                  </Text>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 3시간 신청 시 예상 본인부담금 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">3시간 신청 시 예상 본인부담금</Text>
                  <Text 
                    size="2" 
                    weight="medium"
                    color={isOverLegalRate ? "red" : "green"}
                  >
                    {threeHourSelfPay.toLocaleString()}원
                  </Text>
                </Flex>
                {isOverLegalRate && (
                  <Flex justify="between" align="center" className="mt-1">
                    <Flex align="center" gap="1">
                      <AlertTriangle size={12} className="text-red-500" />
                      <Text size="1" color="red">
                        법정 부담률(15%) 초과
                      </Text>
                    </Flex>
                    <Text size="1" color="gray">
                      (6,750원 + {Math.abs(remainingAmount).toLocaleString()}원)
                    </Text>
                  </Flex>
                )}
              </div>
            </Flex>
          </Card>
        </div>

        {/* 안내 메시지 */}
        {isOverLegalRate ? (
          <Card className="p-4 border-red-200 bg-red-100">    
            <Text size="2" color="red">
                예상 본인부담금이 법정 부담률(15%)을 초과합니다. 계속 진행하시겠습니까?
            </Text>
          </Card>
        ) : (
          <Card className="p-4" style={{ backgroundColor: "var(--accent-3)" }}>
            <Flex align="center" gap="3">
              <div>
                <Text size="2" style={{ color: "var(--accent-9)" }}>
                  사용자의 이용 내역을 기반으로 산출된 결과이며, 실제 서비스 신청 시에는 달라질 수 있습니다.
                </Text>
              </div>
            </Flex>
          </Card>
        )}

        {/* 버튼 */}
        <Flex gap="3" className="mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            size="3"
          >
            취소
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="flex-1"
            size="3"
          >
            {isLoading ? '이동 중...' : '신청서 작성하기'}
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}
