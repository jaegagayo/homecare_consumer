import { Flex, Text, Badge, Card } from '@radix-ui/themes';
import { Calendar, Clock } from 'lucide-react';
import { ConsumerScheduleDetailResponse } from '../../../types/schedule';
import { getMatchStatusColor, getMatchStatusKorean, getServiceTypeKorean } from '../../../utils/koreanTranslations';

interface ServiceInfoCardProps {
  schedule: ConsumerScheduleDetailResponse;
}

export default function ServiceInfoCard({ schedule }: ServiceInfoCardProps) {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  // 시간 포맷팅 함수
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // HH:MM:SS 형식에서 HH:MM 형식으로 변환
    return timeString.substring(0, 5);
  };


  return (
    <Card className="p-4">
      <Flex direction="column" gap="3">
        {/* 서비스 상태 */}
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">{getServiceTypeKorean(schedule.serviceType)}</Text>
          <Flex gap="2" align="center">
            <Badge color={getMatchStatusColor(schedule.matchStatus) as 'orange' | 'blue' | 'green' | 'red' | 'gray'}>
              {getMatchStatusKorean(schedule.matchStatus)}
            </Badge>
          </Flex>
        </Flex>

        {/* 날짜와 시간 */}
        <div className="space-y-2">
          <Flex align="center" gap="2">
            <Calendar size={16} style={{ color: 'var(--accent-9)' }} />
            <Text size="2" color="gray">{formatDate(schedule.serviceDate)}</Text>
          </Flex>
          <Flex align="center" gap="2">
            <Clock size={16} style={{ color: 'var(--accent-9)' }} />
            <Text size="2" color="gray">
              {formatTime(schedule.serviceStartTime)} - {formatTime(schedule.serviceEndTime)} ({schedule.duration}시간)
            </Text>
          </Flex>
        </div>
      </Flex>
    </Card>
  );
}

