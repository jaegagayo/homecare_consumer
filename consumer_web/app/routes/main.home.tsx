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
import { getNextSchedule, getSchedulesWithoutReview, getUnreadRecurringOffers, getRecommendRecurringOffers, getCancelledSchedules } from "../api/home";
import { getStoredConsumerId } from "../api/auth";
import { NextScheduleResponse, ScheduleWithoutReviewResponse, UnreadRecurringOfferResponse, RecommendRecurringOfferResponse, CancelledScheduleResponse } from "../types";

// 백엔드 API 응답 타입을 사용
type Schedule = NextScheduleResponse;

// 백엔드 API 응답 타입을 사용
type RejectedSchedule = CancelledScheduleResponse;

// 백엔드 API 응답 타입을 사용
type RegularProposal = UnreadRecurringOfferResponse;

// 백엔드 API 응답 타입을 사용
type ReviewRequest = ScheduleWithoutReviewResponse;

// 백엔드 API 응답 타입을 사용
type RegularProposalRecommendation = RecommendRecurringOfferResponse;

export default function HomePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // API 데이터 상태
  const [rejections, setRejections] = useState<RejectedSchedule[]>([]);
  const [regularProposals, setRegularProposals] = useState<RegularProposal[]>([]);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [recommendations, setRecommendations] = useState<RegularProposalRecommendation[]>([]);

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

    // API 데이터 로드
    const loadData = async () => {
      try {
        const consumerId = getStoredConsumerId();
        if (!consumerId) {
          throw new Error('Consumer ID not found');
        }

        // 다음 일정 조회 API 호출
        const nextScheduleData = await getNextSchedule(consumerId);
        
        if (nextScheduleData) {
          setSchedules([nextScheduleData]);
        } else {
          setSchedules([]);
        }

        // 리뷰 요청 API 호출
        const reviewRequestsData = await getSchedulesWithoutReview(consumerId);
        setReviewRequests(reviewRequestsData);

        // 취소된 일정 조회 API 호출
        const cancelledSchedulesData = await getCancelledSchedules(consumerId);
        setRejections(cancelledSchedulesData);

        // 정기 제안 알림 API 호출
        const regularProposalsData = await getUnreadRecurringOffers(consumerId);
        setRegularProposals(regularProposalsData);

        // 정기 제안 추천 API 호출
        const recommendationsData = await getRecommendRecurringOffers(consumerId);
        setRecommendations(recommendationsData);

      } catch (error) {
        console.error('Failed to load data:', error);
        // 에러 시 빈 배열로 설정
        setSchedules([]);
        setReviewRequests([]);
        setRejections([]);
        setRegularProposals([]);
        setRecommendations([]);
      }

      setIsLoading(false);
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
        <NextVisitSchedule schedules={schedules} />
        <RejectionNotification rejections={rejections} />
        <RegularProposalNotification proposals={regularProposals} />
        <ReviewRequest reviewRequests={reviewRequests} />
        <RegularProposalRecommendation recommendations={recommendations} />
      </Flex>
    </Container>
  );
}
