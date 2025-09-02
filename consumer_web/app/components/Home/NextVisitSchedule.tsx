import { useNavigate } from "@remix-run/react";
import { 
  Flex, 
  Text,
  Heading,
  Button,
  Badge
} from "@radix-ui/themes";
import { Clock, MapPin } from "lucide-react";
import { NextScheduleResponse, ServiceType } from "../../types";
import { getServiceTypeKorean } from "../../utils/koreanTranslations";

// 백엔드 API 응답 타입을 사용
type Schedule = NextScheduleResponse;

interface NextVisitScheduleProps {
  schedules: Schedule[];
}

export default function NextVisitSchedule({ schedules }: NextVisitScheduleProps) {
  const navigate = useNavigate();

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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* 시간 정보 - 카드 바깥쪽으로 확장 */}
          <div className="rounded-t-lg p-4 space-y-2" style={{ backgroundColor: 'var(--accent-3)' }}>
            <Text size="4" weight="medium" className="block" style={{ color: 'var(--accent-11)' }}>
              {nextSchedule.serviceStartTime} ~ {nextSchedule.serviceEndTime}
            </Text>
            <Text size="3" style={{ color: 'var(--accent-11)' }}>
              시작까지 {calculateTimeRemaining(nextSchedule.serviceDate, nextSchedule.serviceStartTime)} 전
            </Text>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {/* 요양보호사 정보 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Text size="5" weight="bold">{nextSchedule.caregiverName} 요양보호사</Text>
                  <div className="flex gap-2">
                    <Badge color="blue" className="text-xs">{getServiceTypeKorean(nextSchedule.serviceType)}</Badge>
                  </div>
                </div>
                
                {/* 주소 */}
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <Text size="3" color="gray">{nextSchedule.serviceAddress}</Text>
                </div>
              </div>



              {/* 상세 보기 버튼 */}
              <div className="pt-2">
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/main/schedule-detail?id=${nextSchedule.serviceMatchId}`)}
                >
                  상세 보기
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Text color="gray">오늘 예정된 일정이 없습니다.</Text>
        </div>
      )}
    </div>
  );
}
