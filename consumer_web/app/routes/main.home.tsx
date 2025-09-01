import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Heading, 
  Text
} from "@radix-ui/themes";
import {
  NextVisitSchedule,
  RejectionNotification,
  RegularProposalNotification,
  ReviewRequest,
  RegularProposalRecommendation
} from "../components/Home";
import { getHomeData } from "../api/home";
import { getStoredConsumerId } from "../api/auth";
import { NextScheduleResponse, ScheduleWithoutReviewResponse, UnreadRecurringOfferResponse, RecommendRecurringOfferResponse, CancelledScheduleResponse } from "../types";

// 홈 데이터 타입 정의
type HomeData = {
  nextSchedule: NextScheduleResponse | null;
  reviewRequests: ScheduleWithoutReviewResponse[];
  rejections: CancelledScheduleResponse[];
  regularProposals: UnreadRecurringOfferResponse[];
  recommendations: RecommendRecurringOfferResponse[];
};

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 인증 상태 확인
    const consumerId = localStorage.getItem("consumerId");
    if (!consumerId) {
      navigate("/");
      return;
    }

    // 사용자 이름 가져오기
    // 실제로는 API에서 사용자 정보를 가져와야 함
    setUserName("김소비");

    // 통합 홈 데이터 로드
    const loadData = async () => {
      try {
        const consumerId = getStoredConsumerId();
        if (!consumerId) {
          throw new Error('Consumer ID not found');
        }

        const data = await getHomeData(consumerId);
        setHomeData(data);
      } catch (error) {
        console.error('Failed to load data:', error);
        // 에러가 있어도 기본 UI는 표시
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text>로딩 중...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 환영 메시지 */}
        <div>
          <Heading size="5">안녕하세요, {userName}님! 👋</Heading>
          <Text size="3" color="gray">
            오늘도 좋은 하루 되세요
          </Text>
        </div>

        {/* 홈 화면 구성 요소들 - 순서 보장 */}
        <NextVisitSchedule schedules={homeData?.nextSchedule ? [homeData.nextSchedule] : []} />
        <RejectionNotification rejections={homeData?.rejections || []} />
        <RegularProposalNotification proposals={homeData?.regularProposals || []} />
        <ReviewRequest reviewRequests={homeData?.reviewRequests || []} />
        <RegularProposalRecommendation recommendations={homeData?.recommendations || []} />
      </Flex>
    </Container>
  );
}
