import { useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text
} from "@radix-ui/themes";
import { Schedule } from "../../../types/schedule";
import ServiceInfoCard from './ServiceInfoCard';
import CaregiverInfoCard from './CaregiverInfoCard';
import VisitLocationCard from './VisitLocationCard';
import PaymentInfoCard from './PaymentInfoCard';
import RegularScheduleCard from './RegularScheduleCard';
import SpecialNotesCard from './SpecialNotesCard';
import ActionButtons from './ActionButtons';

export default function ScheduleDetailPage() {
  const [searchParams] = useSearchParams();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasReview, setHasReview] = useState(false);

  const scheduleId = searchParams.get('id');

  useEffect(() => {
    const loadScheduleDetail = async () => {
      if (!scheduleId) {
        setError("일정 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // TODO: 실제 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 더미 데이터에서 해당 일정 찾기 (실제 일정 목록과 동일한 데이터)
        const dummySchedules: Schedule[] = [
          {
            id: "1",
            date: "2025-08-29",
            time: "09:00 - 11:00",
            clientName: "김영희",
            address: "서울시 강남구 역삼동 123-45",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "2",
            date: "2025-08-29",
            time: "14:00 - 16:00",
            clientName: "박철수",
            address: "서울시 서초구 서초동 456-78",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 16000
          },
          {
            id: "3",
            date: "2025-08-29",
            time: "18:00 - 20:00",
            clientName: "이순자",
            address: "서울시 마포구 합정동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "4",
            date: "2025-08-30",
            time: "10:00 - 12:00",
            clientName: "최민수",
            address: "서울시 송파구 문정동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 17000
          },
          {
            id: "5",
            date: "2025-08-30",
            time: "15:00 - 17:00",
            clientName: "정미영",
            address: "서울시 강서구 화곡동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "6",
            date: "2025-08-31",
            time: "14:00 - 16:00",
            clientName: "김철수",
            address: "서울시 영등포구 여의도동 789-12",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 18000
          },
          {
            id: "7",
            date: "2025-08-13",
            time: "18:00 - 20:00",
            clientName: "박영희",
            address: "서울시 성동구 성수동 345-67",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 16000
          },
          {
            id: "8",
            date: "2025-08-14",
            time: "10:00 - 12:00",
            clientName: "이미라",
            address: "서울시 광진구 구의동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000,
            isRegular: true,
            regularSequence: { current: 3, total: 12 }
          },
          {
            id: "9",
            date: "2025-08-14",
            time: "15:00 - 17:00",
            clientName: "최동욱",
            address: "서울시 동대문구 신설동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 17000
          },
          {
            id: "10",
            date: "2025-08-15",
            time: "08:00 - 10:00",
            clientName: "한지영",
            address: "서울시 중구 명동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 16000,
            isRegular: true,
            regularSequence: { current: 5, total: 8 }
          },
          {
            id: "11",
            date: "2025-08-15",
            time: "13:00 - 15:00",
            clientName: "송민호",
            address: "서울시 용산구 이태원동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "12",
            date: "2025-08-16",
            time: "11:00 - 13:00",
            clientName: "윤서연",
            address: "서울시 서대문구 신촌동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "13",
            date: "2025-08-16",
            time: "16:00 - 18:00",
            clientName: "임태현",
            address: "서울시 종로구 종로",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 17000
          },
          {
            id: "14",
            date: "2025-08-17",
            time: "09:00 - 11:00",
            clientName: "강미영",
            address: "서울시 노원구 공릉동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "15",
            date: "2025-08-17",
            time: "14:00 - 16:00",
            clientName: "김수진",
            address: "서울시 강남구 청담동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 18000
          },
          {
            id: "16",
            date: "2025-08-17",
            time: "18:00 - 20:00",
            clientName: "이현우",
            address: "서울시 마포구 상암동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 16000
          },
          {
            id: "17",
            date: "2025-08-18",
            time: "10:00 - 12:00",
            clientName: "박지민",
            address: "서울시 강북구 번동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 16000
          },
          {
            id: "18",
            date: "2025-08-18",
            time: "15:00 - 17:00",
            clientName: "정민수",
            address: "서울시 송파구 잠실동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 17000
          },
          {
            id: "19",
            date: "2025-08-19",
            time: "08:00 - 10:00",
            clientName: "최영희",
            address: "서울시 서초구 반포동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000,
            isRegular: true,
            regularSequence: { current: 7, total: 10 }
          },
          {
            id: "20",
            date: "2025-08-19",
            time: "13:00 - 15:00",
            clientName: "김도현",
            address: "서울시 영등포구 당산동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 16000
          },
          {
            id: "21",
            date: "2025-08-19",
            time: "17:00 - 19:00",
            clientName: "박서연",
            address: "서울시 강서구 화곡동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "22",
            date: "2025-08-20",
            time: "09:00 - 11:00",
            clientName: "이준호",
            address: "서울시 동대문구 답십리동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "23",
            date: "2025-08-20",
            time: "14:00 - 16:00",
            clientName: "정수진",
            address: "서울시 광진구 자양동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 17000,
            isRegular: true,
            regularSequence: { current: 6, total: 8 }
          },
          {
            id: "24",
            date: "2025-08-20",
            time: "19:00 - 21:00",
            clientName: "김민지",
            address: "서울시 성동구 왕십리동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 16000
          },
          {
            id: "25",
            date: "2025-08-21",
            time: "08:00 - 10:00",
            clientName: "박현우",
            address: "서울시 중구 신당동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "26",
            date: "2025-08-21",
            time: "12:00 - 14:00",
            clientName: "이지은",
            address: "서울시 용산구 한남동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 18000
          },
          {
            id: "27",
            date: "2025-08-21",
            time: "16:00 - 18:00",
            clientName: "최동욱",
            address: "서울시 서대문구 연희동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 16000
          },
          {
            id: "28",
            date: "2025-08-22",
            time: "10:00 - 12:00",
            clientName: "김서연",
            address: "서울시 종로구 평창동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "29",
            date: "2025-08-22",
            time: "15:00 - 17:00",
            clientName: "정민호",
            address: "서울시 마포구 합정동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 17000
          },
          {
            id: "30",
            date: "2025-08-22",
            time: "19:00 - 21:00",
            clientName: "박지훈",
            address: "서울시 강남구 논현동",
            serviceType: "방문요양",
            status: "upcoming",
            duration: 2,
            hourlyRate: 16000
          }
        ];

        const foundSchedule = dummySchedules.find(s => s.id === scheduleId);
        
        if (!foundSchedule) {
          setError("일정을 불러올 수 없습니다");
          return;
        }

        setSchedule(foundSchedule);
        
        // 리뷰 작성 여부 확인 (완료된 일정의 경우)
        if (foundSchedule.status === 'completed') {
          // TODO: 실제 API 호출로 대체
          setHasReview(Math.random() > 0.5); // 임시로 랜덤 설정
        }
        
      } catch (err) {
        setError("일정을 불러올 수 없습니다");
      } finally {
        setIsLoading(false);
      }
    };

    loadScheduleDetail();
  }, [scheduleId]);

  if (isLoading) {
    return (
      <Container size="2" className="p-4">
        <Text>로딩 중...</Text>
      </Container>
    );
  }

  if (error || !schedule) {
    return (
      <Container size="2" className="p-4">
        <Text color="red">{error || "일정을 불러올 수 없습니다."}</Text>
      </Container>
    );
  }

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="4">
        {/* 서비스 정보 */}
        <ServiceInfoCard schedule={schedule} />

        {/* 정기 일정 정보 (정기 일정인 경우에만 표시) */}
        <RegularScheduleCard schedule={schedule} />

        {/* 요양보호사 정보 */}
        <CaregiverInfoCard schedule={schedule} />

        {/* 방문 위치 정보 */}
        <VisitLocationCard schedule={schedule} />

        {/* 특이사항 */}
        <SpecialNotesCard schedule={schedule} />

        {/* 결제 정보 */}
        <PaymentInfoCard schedule={schedule} />

        {/* 하단 CTA */}
        <ActionButtons 
          schedule={schedule} 
          scheduleId={scheduleId!} 
          hasReview={hasReview}
        />
      </Flex>
    </Container>
  );
}
