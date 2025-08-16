import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import {
  Container,
  Flex,
  Text,
  Button,
  Heading,
  Card,
  Badge
} from "@radix-ui/themes";
import {
  CheckCircle,
  User,
  Star
} from "lucide-react";

interface Caregiver {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  experience: number;
  rating: number;
  specialties: string[];
}

interface ServiceRequest {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  address: string;
  totalDays: number;
  specialRequests?: string;
  status: 'pending' | 'matched' | 'completed';
  matchedCaregiver?: Caregiver;
}

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // location.state에서 확정된 정보를 가져옴
  const confirmedData = location.state?.confirmedData as {
    caregiver: Caregiver;
    serviceRequest: ServiceRequest;
  };

  useEffect(() => {
    // 확정된 데이터가 없으면 매칭 페이지로 리다이렉트
    if (!confirmedData) {
      navigate('/main/matching');
    }
  }, [confirmedData, navigate]);

  const handleGoHome = () => {
    setIsLoading(true);
    // 홈으로 이동
    navigate('/main/home');
  };

  if (!confirmedData) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text>로딩 중...</Text>
        </Flex>
      </Container>
    );
  }

  const { caregiver, serviceRequest } = confirmedData;

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 헤더 */}
        <div className="text-center">
          <Flex align="center" justify="center" gap="2" className="mb-3">
            <CheckCircle size={24} className="text-green-600" />
            <Heading size="5">서비스 신청이 완료되었습니다</Heading>
          </Flex>
          <Text size="3" color="gray">
            선택하신 요양보호사와 서비스 일정을 확인해주세요
          </Text>
        </div>

        {/* 보호사 프로필 요약 */}
        <div>
          <Heading size="4" className="mb-4">요양보호사 정보</Heading>
          <Card className="p-4">
            <Flex align="center" gap="3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <Flex direction="column" className="flex-1">
                <Text size="3" weight="medium">{caregiver.name}</Text>
                <Text size="2" color="gray">
                  경력 {caregiver.experience}년 • 평점 {caregiver.rating}
                  <Star size={12} className="text-yellow-500 fill-current inline ml-1" />
                </Text>
                {caregiver.specialties && caregiver.specialties.length > 0 && (
                  <Flex gap="1" wrap="wrap" className="mt-1">
                    {caregiver.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} color="blue" size="1">
                        {specialty}
                      </Badge>
                    ))}
                    {caregiver.specialties.length > 2 && (
                      <Text size="1" color="gray">+{caregiver.specialties.length - 2}</Text>
                    )}
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Card>
        </div>

        {/* 선택 일정 요약 */}
        <div>
          <Heading size="4" className="mb-4">확정된 서비스 일정</Heading>
          <Card className="p-4">
            <Flex direction="column" gap="4">
              {/* 서비스 유형 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 유형</Text>
                  <Badge color="blue">{serviceRequest.serviceType}</Badge>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 날짜 및 시간 */}
              <div>
                <Flex justify="between" align="center" className="mb-2">
                  <Text size="2" weight="medium">서비스 기간</Text>
                  <Text size="2" color="gray">{serviceRequest.date} (총 {serviceRequest.totalDays}일)</Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 시간</Text>
                  <Text size="2" color="gray">{serviceRequest.time}</Text>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 주소 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 주소</Text>
                  <Text size="2">{serviceRequest.address}</Text>
                </Flex>
              </div>

              {/* 특별 요청사항이 있는 경우에만 표시 */}
              {serviceRequest.specialRequests && (
                <>
                  <div className="w-full h-px bg-gray-200"></div>
                  <div>
                    <Text size="2" weight="medium" className="mb-2 block">특별 요청사항</Text>
                    <Text size="2" className="leading-relaxed whitespace-pre-line">
                      {serviceRequest.specialRequests}
                    </Text>
                  </div>
                </>
              )}
            </Flex>
          </Card>
        </div>

        {/* CTA: 홈으로 이동 */}
        <Button
          size="3"
          onClick={handleGoHome}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '이동 중...' : '홈으로 이동'}
        </Button>
      </Flex>
    </Container>
  );
}
