import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Heading, 
  Text, 
  Button,
  Badge
} from "@radix-ui/themes";
import { 
  Clock, 
  MapPin, 
  User
} from "lucide-react";

interface Schedule {
  id: string;
  time: string;
  caregiverName: string;
  address: string;
  serviceType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function HomePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
          caregiverName: "김케어",
          address: "서울시 강남구 역삼동",
          serviceType: "방문요양",
          status: "upcoming"
        },
        {
          id: "2",
          time: "14:00 - 16:00",
          caregiverName: "박케어",
          address: "서울시 서초구 서초동",
          serviceType: "방문요양",
          status: "upcoming"
        },
        {
          id: "3",
          time: "08:00 - 10:00",
          caregiverName: "이케어",
          address: "서울시 마포구 합정동",
          serviceType: "방문요양",
          status: "completed"
        }
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

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
            {schedules.filter(s => s.status === 'upcoming').length > 0 
              ? "곧 다가오는 서비스를 확인해 보세요" 
              : "오늘도 좋은 하루 되세요"
            }
          </Text>
        </div>



        {/* 곧 받을 서비스 */}
        {schedules.filter(s => s.status === 'upcoming').length > 0 ? (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            {schedules.filter(s => s.status === 'upcoming').slice(0, 1).map((schedule) => (
              <div key={schedule.id} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-0">
                    <div>
                      <Text size="5" weight="bold">{schedule.caregiverName} 요양보호사</Text>
                    </div>
                    <div>
                      <Text size="3" color="gray">{schedule.address}</Text>
                    </div>
                  </div>
                  <Text size="2" color="gray" className="bg-gray-100 px-2 py-1 rounded">
                    {schedule.serviceType}
                  </Text>
                </div>
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
                  <Text size="2" color="gray">지도 영역</Text>
                </div>
                <div>
                  <Text size="3" color="gray">
                    시작까지 {calculateTimeRemaining(schedule.time)} 전 ({schedule.time})
                  </Text>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <Flex justify="between" align="center">
                    <Flex align="center" gap="2">
                      <Clock size={16} className="text-gray-500" />
                      <Text size="2" color="gray">{schedule.time}</Text>
                    </Flex>
                    <Badge color={getStatusColor(schedule.status) as any}>
                      {getStatusText(schedule.status)}
                    </Badge>
                  </Flex>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <Text size="3" color="gray">오늘 예정된 서비스가 없습니다</Text>
            <Text size="2" color="gray" className="mt-2">
              새로운 서비스를 요청해보세요
            </Text>
          </div>
        )}

        {/* 최근 완료된 서비스 */}
        {schedules.filter(s => s.status === 'completed').length > 0 && (
          <div>
            <Heading size="4" className="mb-4">최근 완료된 서비스</Heading>
            <div className="space-y-3">
              {schedules.filter(s => s.status === 'completed').slice(0, 2).map((schedule) => (
                <div key={schedule.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <Flex justify="between" align="center">
                    <div>
                      <Text size="3" weight="medium">{schedule.caregiverName} 요양보호사</Text>
                      <Text size="2" color="gray">{schedule.time}</Text>
                    </div>
                    <Badge color="green">완료</Badge>
                  </Flex>
                </div>
              ))}
            </div>
          </div>
        )}
      </Flex>
    </Container>
  );
}
