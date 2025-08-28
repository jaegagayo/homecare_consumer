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

interface Schedule {
  id: string;
  time: string;
  caregiverName: string;
  address: string;
  serviceType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface RejectedSchedule {
  id: string;
  date: string;
  time: string;
  caregiverName: string;
  serviceType: string;
  rejectionReason?: string;
}

interface RegularProposal {
  id: string;
  date: string;
  time: string;
  caregiverName: string;
  serviceType: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ReviewRequest {
  id: string;
  date: string;
  time: string;
  caregiverName: string;
  serviceType: string;
  completedAt: string;
}

interface RegularProposalRecommendation {
  id: string;
  dayOfWeek: string;
  timeSlot: string;
  period: string;
  caregiverName: string;
  serviceType: string;
  reviewRating: number;
}

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
    const token = localStorage.getItem("consumer_token");
    if (!token) {
      navigate("/");
      return;
    }

    // 사용자 이름 가져오기
    // 실제로는 API에서 사용자 정보를 가져와야 함
    setUserName("김소비");

    // 더미 데이터 로드
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSchedules([
        {
          id: "1",
          time: "09:00 - 11:00",
          caregiverName: "김요양사",
          address: "서울시 강남구 역삼동 123-45",
          serviceType: "방문요양",
          status: "upcoming"
        },
        {
          id: "2",
          time: "14:00 - 16:00",
          caregiverName: "박요양사",
          address: "서울시 서초구 서초동 456-78",
          serviceType: "방문요양",
          status: "upcoming"
        },
        {
          id: "3",
          time: "18:00 - 20:00",
          caregiverName: "이요양사",
          address: "서울시 마포구 합정동",
          serviceType: "방문요양",
          status: "upcoming"
        }
      ]);

      // 거절 알림 더미 데이터
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

      // 정기제안 알림 더미 데이터
      setRegularProposals([
        {
          id: "proposal_1",
          date: "2024-01-20",
          time: "09:00 - 11:00",
          caregiverName: "김요양사",
          serviceType: "방문요양",
          status: "pending"
        },
        {
          id: "proposal_2",
          date: "2024-01-22",
          time: "14:00 - 16:00",
          caregiverName: "이요양사",
          serviceType: "방문요양",
          status: "approved"
        },
        {
          id: "proposal_3",
          date: "2024-01-25",
          time: "10:00 - 12:00",
          caregiverName: "박요양사",
          serviceType: "방문요양",
          status: "rejected"
        }
      ]);

      // 리뷰 요청 더미 데이터
      setReviewRequests([
        {
          id: "review_1",
          date: "2024-01-18",
          time: "14:00 - 16:00",
          caregiverName: "최요양사",
          serviceType: "방문요양",
          completedAt: "2024-01-18T16:00:00"
        },
        {
          id: "review_2",
          date: "2024-01-16",
          time: "10:00 - 12:00",
          caregiverName: "박요양사",
          serviceType: "방문요양",
          completedAt: "2024-01-16T12:00:00"
        },
        {
          id: "review_3",
          date: "2024-01-14",
          time: "09:00 - 11:00",
          caregiverName: "정요양사",
          serviceType: "방문요양",
          completedAt: "2024-01-14T11:00:00"
        }
      ]);

      // 정기 제안 추천 더미 데이터
      setRecommendations([
        {
          id: "rec_1",
          dayOfWeek: "월요일",
          timeSlot: "09:00 - 11:00",
          period: "3개월",
          caregiverName: "김요양사",
          serviceType: "방문요양",
          reviewRating: 4.5
        },
        {
          id: "rec_2",
          dayOfWeek: "수요일",
          timeSlot: "14:00 - 16:00",
          period: "6개월",
          caregiverName: "이요양사",
          serviceType: "방문요양",
          reviewRating: 4.8
        },
        {
          id: "rec_3",
          dayOfWeek: "금요일",
          timeSlot: "10:00 - 12:00",
          period: "12개월",
          caregiverName: "최요양사",
          serviceType: "방문요양",
          reviewRating: 4.9
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
