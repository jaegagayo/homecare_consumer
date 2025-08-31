import { Flex, Text, Badge, Card } from '@radix-ui/themes';
import { Calendar, Clock } from 'lucide-react';
import { ConsumerScheduleDetailResponse } from '../../../types/schedule';

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

  // 시간에서 duration 추출 (예: "14:00 - 16:00"에서 2시간 계산)
  const getDuration = (timeString: string) => {
    const [start, end] = timeString.split(' - ');
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    const diffHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return `${diffHours}시간`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'CONFIRMED': return 'blue';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '승인대기';
      case 'CONFIRMED': return '예정';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return '알 수 없음';
    }
  };



  return (
    <Card className="p-4">
      <Flex direction="column" gap="3">
        {/* 서비스 상태 */}
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">{schedule.serviceType}</Text>
          <Flex gap="2" align="center">
            <Badge color={getStatusColor(schedule.matchStatus) as 'orange' | 'blue' | 'green' | 'red' | 'gray'}>
              {getStatusText(schedule.matchStatus)}
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
            <Text size="2" color="gray">{schedule.serviceStartTime} - {schedule.serviceEndTime} ({schedule.duration}시간)</Text>
          </Flex>
        </div>




      </Flex>
    </Card>
  );
}

