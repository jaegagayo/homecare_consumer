import { useNavigate } from "@remix-run/react";
import { 
  Flex, 
  Text,
  Heading,
  Button
} from "@radix-ui/themes";
import { Clock } from "lucide-react";
import { NextScheduleResponse } from "../../types";

// 백엔드 API 응답 타입을 사용
type Schedule = NextScheduleResponse;

interface NextVisitScheduleProps {
  schedules: Schedule[];
}

export default function NextVisitSchedule({ schedules }: NextVisitScheduleProps) {
  const navigate = useNavigate();

  const getServiceTypeKorean = (serviceType: string) => {
    switch (serviceType) {
      case 'CARE': return '요양';
      case 'COMPANION': return '동반';
      case 'HOUSEKEEPING': return '가사';
      default: return serviceType;
    }
  };

  const calculateTimeRemaining = (serviceDate: string, startTime: string) => {
    // 서비스 날짜와 시작 시간을 결합하여 Date 객체 생성
    const scheduleDateTime = new Date(`${serviceDate}T${startTime}`);
    
    // 현재 시간과의 차이 계산
    const now = new Date();
    const diffMs = scheduleDateTime.getTime() - now.getTime();
    
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

  // 다음 일정이 있는지 확인 (현재 날짜 이후의 일정)
  const nextSchedule = schedules.find(schedule => {
    const scheduleDate = new Date(schedule.serviceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return scheduleDate >= today;
  });

  return (
    <div>
      <Heading size="4" className="mb-4">다음 방문 일정</Heading>
      {nextSchedule ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-0">
                <div>
                  <Text size="5" weight="bold">{nextSchedule.caregiverName} 요양보호사</Text>
                </div>
                <div>
                  <Text size="3" color="gray">{nextSchedule.serviceAddress}</Text>
                </div>
              </div>
              <Text size="2" color="gray" className="bg-gray-100 px-2 py-1 rounded">
                {getServiceTypeKorean(nextSchedule.serviceType)}
              </Text>
            </div>
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
              <Text size="2" color="gray">지도 영역</Text>
            </div>
            <div>
              <Text size="3" color="gray">
                시작까지 {calculateTimeRemaining(nextSchedule.serviceDate, nextSchedule.serviceStartTime)} 전 ({nextSchedule.serviceStartTime} - {nextSchedule.serviceEndTime})
              </Text>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <Flex justify="between" align="center">
                <Flex align="center" gap="2">
                  <Clock size={16} className="text-gray-500" />
                  <Text size="2" color="gray">{nextSchedule.serviceStartTime} - {nextSchedule.serviceEndTime}</Text>
                </Flex>
                <Text size="2" color="gray">{nextSchedule.serviceDate}</Text>
              </Flex>
            </div>
            <div className="pt-2">
              <Button 
                className="w-full"
                onClick={() => navigate(`/main/schedule-detail?id=${nextSchedule.caregiverName}`)}
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
