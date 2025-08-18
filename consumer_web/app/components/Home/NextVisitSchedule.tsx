import { useNavigate } from "@remix-run/react";
import { 
  Flex, 
  Text,
  Badge,
  Heading,
  Button
} from "@radix-ui/themes";
import { Clock } from "lucide-react";

interface Schedule {
  id: string;
  time: string;
  caregiverName: string;
  address: string;
  serviceType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface NextVisitScheduleProps {
  schedules: Schedule[];
}

export default function NextVisitSchedule({ schedules }: NextVisitScheduleProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return '예정';
      case 'completed': return '완료';
      case 'cancelled': return '취소';
      default: return '알 수 없음';
    }
  };

  const calculateTimeRemaining = (timeString: string) => {
    // "09:00 - 11:00" 형태에서 시작 시간 추출
    const startTime = timeString.split(' - ')[0];
    const [hours, minutes] = startTime.split(':').map(Number);
    
    // 오늘 날짜로 시작 시간 설정
    const today = new Date();
    const scheduleTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    
    // 현재 시간과의 차이 계산
    const now = new Date();
    const diffMs = scheduleTime.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return '곧 시작';
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}시간 ${diffMinutes}분`;
    } else {
      return `${diffMinutes}분`;
    }
  };

  const upcomingSchedules = schedules.filter(s => s.status === 'upcoming');

  return (
    <div>
      <Heading size="4" className="mb-4">다음 방문 일정</Heading>
      {upcomingSchedules.length > 0 ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0">
                <div>
                  <Text size="5" weight="bold">{upcomingSchedules[0].caregiverName} 요양보호사</Text>
                </div>
                <div>
                  <Text size="3" color="gray">{upcomingSchedules[0].address}</Text>
                </div>
              </div>
              <Text size="2" color="gray" className="bg-gray-100 px-2 py-1 rounded">
                {upcomingSchedules[0].serviceType}
              </Text>
            </div>
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
              <Text size="2" color="gray">지도 영역</Text>
            </div>
            <div>
              <Text size="3" color="gray">
                시작까지 {calculateTimeRemaining(upcomingSchedules[0].time)} 전 ({upcomingSchedules[0].time})
              </Text>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <Flex justify="between" align="center">
                <Flex align="center" gap="2">
                  <Clock size={16} className="text-gray-500" />
                  <Text size="2" color="gray">{upcomingSchedules[0].time}</Text>
                </Flex>
                <Badge color={getStatusColor(upcomingSchedules[0].status) as any}>
                  {getStatusText(upcomingSchedules[0].status)}
                </Badge>
              </Flex>
            </div>
            <div className="pt-2">
              <Button 
                className="w-full"
                onClick={() => navigate(`/main/schedule-detail?id=${upcomingSchedules[0].id}`)}
              >
                상세 보기
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <Text size="3" color="gray">아직 신청한 일정이 없습니다</Text>
        </div>
      )}
    </div>
  );
}
