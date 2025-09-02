import { Flex, Text, Heading, Card, Badge } from "@radix-ui/themes";
import { getServiceTypeKorean } from "../../../utils";

interface RecommendationData {
  id: string;
  dayOfWeek: string;
  timeSlot: string;
  period: string;
  caregiverName: string;
  serviceType: string;
  reviewRating: number;
  caregiverPhone: string;
}

interface ServiceInfoCardProps {
  recommendationData: RecommendationData;
  address: string;
}

export default function ServiceInfoCard({ recommendationData, address }: ServiceInfoCardProps) {
  return (
    <div>
      <div className="mb-4">
        <Heading size="3">서비스 정보</Heading>
        <Text size="2" color="gray">정기 서비스 신청 시 변경할 수 없습니다.</Text>
      </div>
      <Card className="p-4">
        <Flex direction="column" gap="4">
          {/* 요양보호사 정보 */}
          <div>
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">요양보호사</Text>
              <Flex align="center" gap="2">
                <Text size="3" weight="medium">
                  {recommendationData.caregiverName}
                </Text>
                <Text size="2" color="gray">
                  {recommendationData.caregiverPhone}
                </Text>
              </Flex>
            </Flex>
          </div>

          <div className="w-full h-px bg-gray-200"></div>

          {/* 서비스 유형 */}
          <div>
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">서비스 유형</Text>
              <Badge color="blue">{getServiceTypeKorean(recommendationData.serviceType as any)}</Badge>
            </Flex>
          </div>

          <div className="w-full h-px bg-gray-200"></div>

          {/* 서비스 주소 */}
          <div>
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">서비스 주소</Text>
              <Text size="2">{address || '주소 정보가 필요합니다'}</Text>
            </Flex>
          </div>
        </Flex>
      </Card>
    </div>
  );
}
