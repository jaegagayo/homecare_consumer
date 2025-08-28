import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Badge,
  Card
} from "@radix-ui/themes";
import { 
  StarIcon
} from "@radix-ui/react-icons";
import { Schedule } from "../types/schedule";

export default function ScheduleDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get('id');
  
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasReview, setHasReview] = useState(false);

  useEffect(() => {
    const loadScheduleDetail = async () => {
      try {
        setIsLoading(true);
        
        // TODO: 실제 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 더미 데이터에서 해당 일정 찾기 (실제 일정 목록과 동일한 데이터)
        const dummySchedules: Schedule[] = [
          {
            id: "1",
            date: "2025-08-11",
            time: "09:00 - 11:00",
            clientName: "김영희",
            
            address: "서울시 강남구 역삼동 123-45",
            serviceType: "방문요양",
            status: "completed",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "2",
            date: "2025-08-11",
            time: "14:00 - 16:00",
            clientName: "박철수",
            
            address: "서울시 서초구 서초동 456-78",
            serviceType: "방문요양",
            status: "completed",
            duration: 2,
            hourlyRate: 16000
          },
          {
            id: "3",
            date: "2025-08-12",
            time: "08:00 - 10:00",
            clientName: "이순자",
            
            address: "서울시 마포구 합정동",
            serviceType: "방문요양",
            status: "completed",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "4",
            date: "2025-08-12",
            time: "13:00 - 15:00",
            clientName: "최민수",
            
            address: "서울시 송파구 문정동",
            serviceType: "방문요양",
            status: "completed",
            duration: 2,
            hourlyRate: 17000
          },
          {
            id: "5",
            date: "2025-08-13",
            time: "09:00 - 11:00",
            clientName: "정미영",
            
            address: "서울시 강서구 화곡동",
            serviceType: "방문요양",
            status: "completed",
            duration: 2,
            hourlyRate: 15000
          },
          {
            id: "6",
            date: "2025-08-13",
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

    if (scheduleId) {
      loadScheduleDetail();
    }
  }, [scheduleId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'orange';
      case 'upcoming': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_approval': return '승인대기';
      case 'upcoming': return '예정';
      case 'completed': return '완료';
      case 'cancelled': return '취소';
      default: return '알 수 없음';
    }
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday}) ${timeString}`;
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return weekdays[date.getDay()];
  };

  const handleWriteReview = () => {
    if (!schedule) return;
    
    navigate(`/main/review-write?serviceId=${schedule.id}&serviceType=${schedule.serviceType}&serviceDate=${schedule.date}&serviceTime=${schedule.time}`);
  };

  const handleViewReview = () => {
    // TODO: 작성된 리뷰 보기 페이지로 이동
    navigate(`/main/reviews?reviewId=${schedule?.id}`);
  };

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

  if (error || !schedule) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <Text color="red" size="4">{error || "일정을 불러올 수 없습니다"}</Text>
          <Button onClick={() => navigate('/main/schedule')}>
            일정 목록으로 돌아가기
          </Button>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 헤더 */}
        <Flex direction="column" gap="3">
          {/* 날짜/시간, 요양보호사 이름, 상태 */}
          <Flex justify="between" align="center">
            <Flex direction="column" gap="1">
              <Text size="4" weight="bold">
                {formatDateTime(schedule.date, schedule.time)}
              </Text>
              <Text size="3" weight="medium" color="gray">
                요양보호사
              </Text>
            </Flex>
            <Flex direction="column" align="end" gap="2">
              <Badge 
                color={getStatusColor(schedule.status) as 'orange' | 'blue' | 'green' | 'red' | 'gray'}
                variant="soft"
                size="2"
              >
                {getStatusText(schedule.status)}
              </Badge>
              {schedule.isRegular && schedule.regularSequence && (
                <Badge variant="soft" color="purple" size="1">
                  {schedule.regularSequence.current}회차 (총 {schedule.regularSequence.total}회)
                </Badge>
              )}
            </Flex>
          </Flex>
        </Flex>

        {/* 본문 */}
        <Card style={{ padding: '20px' }}>
          <Flex direction="column" gap="4">
            {/* 방문 주소 */}
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">방문 주소</Text>
              <Text size="3" weight="medium">{schedule.address}</Text>
            </Flex>

            <div className="w-full h-px bg-gray-200"></div>

            {/* 요청 상세 */}
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">서비스 정보</Text>
              <Text size="3" weight="medium">{schedule.serviceType}</Text>
              <Text size="2" color="gray">
                {schedule.duration}시간 · ₩{schedule.hourlyRate.toLocaleString()}/시간
              </Text>
            </Flex>

            <div className="w-full h-px bg-gray-200"></div>

            {/* 정기 일정 패턴 요약 */}
            {schedule.isRegular && schedule.regularSequence && (
              <>
                <Flex direction="column" gap="1">
                  <Text size="2" color="gray">정기 일정 패턴</Text>
                  <Text size="3" weight="medium">
                    매주 {getDayOfWeek(schedule.date)} {schedule.time}
                  </Text>
                  <Text size="2" color="gray">
                    총 {schedule.regularSequence.total}회 중 {schedule.regularSequence.current}회차
                  </Text>
                </Flex>
                <div className="w-full h-px bg-gray-200"></div>
              </>
            )}

            {/* 요양보호사 연락처 */}
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">요양보호사 연락처</Text>
              <Text size="3" weight="medium">요양보호사</Text>
              <Text size="2" color="gray">010-1234-5678</Text>
            </Flex>

            {/* 총 금액 */}
            <div className="w-full h-px bg-gray-200"></div>
            <Flex justify="between" align="center">
              <Text size="3" weight="medium">총 금액</Text>
              <Text size="4" weight="bold" color="blue">
                ₩{(schedule.hourlyRate * schedule.duration).toLocaleString()}
              </Text>
            </Flex>
          </Flex>
        </Card>

        {/* 하단 버튼들 */}
        {schedule.status === 'completed' && (
          <Flex direction="column" gap="4">
            {/* 완료된 일정의 경우 리뷰 버튼 */}
            {hasReview ? (
              <Button 
                variant="outline" 
                onClick={handleViewReview}
                style={{ width: '100%' }}
              >
                <StarIcon width="16" height="16" />
                작성한 리뷰 보기
              </Button>
            ) : (
              <Button 
                onClick={handleWriteReview}
                style={{ width: '100%' }}
              >
                <StarIcon width="16" height="16" />
                리뷰 작성
              </Button>
            )}

            {/* 일정 목록으로 돌아가기 버튼 */}
            <Button 
              variant="outline" 
              onClick={() => navigate('/main/schedule')}
              style={{ width: '100%' }}
            >
              일정 목록으로 돌아가기
            </Button>
          </Flex>
        )}

        {/* 승인대기, 예정 상태는 안내 메시지 */}
        {(schedule.status === 'upcoming') && (
          <Flex direction="column" gap="3">
            <Text size="2" color="gray" style={{ textAlign: 'center' }}>
              '확정된 일정입니다.'
            </Text>
            <Button 
              variant="outline" 
              onClick={() => navigate('/main/schedule')}
              style={{ width: '100%' }}
            >
              일정 목록으로 돌아가기
            </Button>
          </Flex>
        )}
      </Flex>
    </Container>
  );
}
