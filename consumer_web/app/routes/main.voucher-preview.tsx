import { useState, useEffect } from "react";
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
import { getVoucherUsageGuide } from "../api/voucher";
import { getStoredConsumerId } from "../api/auth";
import { VoucherUsageGuideResponse } from "../types/voucher";

export default function VoucherPreviewPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [voucherData, setVoucherData] = useState<VoucherUsageGuideResponse | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

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
        setIsLoadingData(false);
      }
    };

    loadVoucherInfo();
  }, []);

  // 로딩 중일 때 표시
  if (isLoadingData) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text>바우처 정보를 불러오는 중...</Text>
        </Flex>
      </Container>
    );
  }

  // 바우처 데이터가 없을 때
  if (!voucherData) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <Text>바우처 정보를 불러올 수 없습니다.</Text>
          <Button onClick={() => navigate('/main/home')}>
            홈으로 돌아가기
          </Button>
        </Flex>
      </Container>
    );
  }

  // 백엔드에서 받은 데이터 사용
  const {
    remainingAmount,
    expectedUsageAmount,
    expectedCopay,
    isHighCopayRate
  } = voucherData;

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
        </div>

        {/* 안내 메시지 */}
        {isHighCopayRate ? (
          <Card className="p-4 border-red-200 bg-red-100">    
            <Text size="2" color="red">
                예상 본인부담금이 지원금 한도를 초과합니다. 계속 진행하시겠습니까?
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
