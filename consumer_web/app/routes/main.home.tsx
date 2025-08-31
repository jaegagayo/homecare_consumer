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
import { getNextSchedule, getSchedulesWithoutReview, getUnreadRecurringOffers, getRecommendRecurringOffers } from "../api/home";
import { getStoredConsumerId } from "../api/auth";
import { NextScheduleResponse, ScheduleWithoutReviewResponse, UnreadRecurringOfferResponse, RecommendRecurringOfferResponse } from "../types";

// 백엔드 API 응답 타입을 사용
type Schedule = NextScheduleResponse;

interface RejectedSchedule {
  id: string;
  date: string;
  time: string;
  caregiverName: string;
  serviceType: string;
  rejectionReason?: string;
}

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

  // 더미 데이터 - 나중에 실제 API로 교체
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
        setRegularProposals([]);
        setRecommendations([]);
      }

      // 취소된 일정 알림 더미 데이터
      setRejections([
        {
          id: "rejected_1",
          date: "2024-01-15",
          time: "14:00 - 16:00",
          caregiverName: "최요양사",
          serviceType: "방문요양",
          rejectionReason: "개인 사정으로 인한 취소"
        },
        {
          id: "rejected_2", 
          date: "2024-01-16",
          time: "10:00 - 12:00",
          caregiverName: "정요양사",
          serviceType: "방문요양",
          rejectionReason: "일정 변경 요청"
        }
      ]);

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
