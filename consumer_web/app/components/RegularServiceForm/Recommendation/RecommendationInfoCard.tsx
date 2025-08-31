import { Flex, Text, Heading, Card } from "@radix-ui/themes";

interface RecommendationData {
  id: string;
  dayOfWeek: string;
  timeSlot: string;
  period: string;
  caregiverName: string;
  serviceType: string;
  reviewRating: number;
  caregiverGender: 'male' | 'female';
  caregiverAge: number;
  caregiverExperience: number;
}

interface RecommendationInfoCardProps {
  recommendationData: RecommendationData;
}

export default function RecommendationInfoCard({ recommendationData }: RecommendationInfoCardProps) {
  return (
    <div>
      <div className="mb-4">
        <Heading size="3">추천 정보</Heading>
        <Text size="2" color="gray">이용하신 서비스를 바탕으로 한 추천 정보입니다.</Text>
      </div>
      <Card className="p-4">
        <Flex direction="column" gap="4">
          {/* 서비스 일정 */}
          <div>
            <Flex justify="between" align="center" className="mb-2">
              <Text size="2" weight="medium">서비스 요일</Text>
              <Text size="2">{recommendationData.dayOfWeek}</Text>
            </Flex>
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">서비스 시간</Text>
              <Text size="2">{recommendationData.timeSlot}</Text>
            </Flex>
          </div>
        </Flex>
      </Card>
    </div>
  );
}
