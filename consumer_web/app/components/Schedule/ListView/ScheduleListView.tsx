import { useState } from 'react';
import { Flex, Text, Badge, Card, Button, ScrollArea } from '@radix-ui/themes';
import { PersonIcon, CalendarIcon } from '@radix-ui/react-icons';
import { Schedule } from '../../../types/schedule';

interface ScheduleListViewProps {
  schedules: Schedule[];
}

export default function ScheduleListView({ schedules }: ScheduleListViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<'scheduled-all' | 'scheduled-regular' | 'completed'>('scheduled-all');



  // 필터별 일정 분류
  const getFilteredSchedules = () => {
    switch (selectedFilter) {
      case 'scheduled-all':
        return schedules.filter(s => s.status === 'upcoming' || s.status === 'pending_approval');
      case 'scheduled-regular':
        return schedules.filter(s => 
          (s.status === 'upcoming' || s.status === 'pending_approval') && s.isRegular
        );
      case 'completed':
        return schedules.filter(s => s.status === 'completed');
      default:
        return schedules;
    }
  };

  const filteredSchedules = getFilteredSchedules();

  // 정렬: 예정은 다가오는 순, 완료는 최근 순
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    if (selectedFilter === 'completed') {
      // 완료된 일정은 최근 순 (역순)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      // 예정된 일정은 다가오는 순
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

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

  const isToday = (dateString: string) => {
    const today = new Date();
    const scheduleDate = new Date(dateString);
    return today.toDateString() === scheduleDate.toDateString();
  };

  const handleScheduleClick = (schedule: Schedule) => {
    // TODO: 일정 상세 화면으로 이동
    console.log('일정 상세 화면으로 이동:', schedule.id);
  };

  return (
    <Flex direction="column" gap="4" style={{ flex: 1, overflow: 'auto' }}>
      {/* 필터칩 */}
      <Flex gap="2" wrap="wrap">
        <Button 
          variant={selectedFilter === 'scheduled-all' ? 'solid' : 'ghost'} 
          size="2"
          onClick={() => setSelectedFilter('scheduled-all')}
        >
          예정-전체 ({schedules.filter(s => s.status === 'upcoming' || s.status === 'pending_approval').length})
        </Button>
        <Button 
          variant={selectedFilter === 'scheduled-regular' ? 'solid' : 'ghost'} 
          size="2"
          onClick={() => setSelectedFilter('scheduled-regular')}
        >
          예정-정기 ({schedules.filter(s => 
            (s.status === 'upcoming' || s.status === 'pending_approval') && s.isRegular
          ).length})
        </Button>
        <Button 
          variant={selectedFilter === 'completed' ? 'solid' : 'ghost'} 
          size="2"
          onClick={() => setSelectedFilter('completed')}
        >
          완료 ({schedules.filter(s => s.status === 'completed').length})
        </Button>
      </Flex>

              {/* 일정 리스트 */}
        <ScrollArea type="always" scrollbars="vertical" style={{ height: 'calc(100vh - 300px)' }}>
          <Flex direction="column" gap="2" p="2">
            {sortedSchedules.length === 0 ? (
              <Card style={{ padding: '32px', textAlign: 'center' }}>
                <Text color="gray" size="3">
                  {selectedFilter === 'completed' ? '완료된 일정이 없습니다.' : '예정된 일정이 없습니다.'}
                </Text>
              </Card>
            ) : (
              sortedSchedules.map((schedule) => (
                <Card 
                  key={schedule.id} 
                  style={{ 
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isToday(schedule.date) ? '2px solid var(--accent-9)' : '1px solid var(--gray-6)'
                  }}
                  onClick={() => handleScheduleClick(schedule)}
                >
                  <Flex direction="column" gap="3">
                    {/* 헤더: 날짜·시간, 상태 배지 */}
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="2">
                        <CalendarIcon width="16" height="16" color="var(--gray-11)" />
                        <Text 
                          size="3" 
                          weight="bold"
                          style={{ 
                            color: isToday(schedule.date) ? 'var(--accent-9)' : 'inherit' 
                          }}
                        >
                          {formatDateTime(schedule.date, schedule.time)}
                          {isToday(schedule.date) && ' (오늘)'}
                        </Text>
                      </Flex>
                      <Flex gap="2" align="center">
                        {/* 정기 일정 배지 */}
                        {schedule.isRegular && schedule.regularSequence && (
                          <Badge variant="soft" color="purple">
                            정기·{schedule.regularSequence.current}/{schedule.regularSequence.total}
                          </Badge>
                        )}
                        {/* 상태 배지 */}
                        <Badge 
                          color={getStatusColor(schedule.status) as 'orange' | 'blue' | 'green' | 'red' | 'gray'}
                          variant="soft"
                        >
                          {getStatusText(schedule.status)}
                        </Badge>
                      </Flex>
                    </Flex>

                    {/* 보호사 이름 */}
                    <Flex align="center" gap="2">
                      <PersonIcon width="16" height="16" color="var(--gray-11)" />
                      <Text size="3" weight="bold">{schedule.caregiverName}</Text>
                    </Flex>

                    {/* 서비스 타입 */}
                    <Text size="3" color="blue">
                      {schedule.serviceType}
                    </Text>
                  </Flex>
                </Card>
              ))
            )}
          </Flex>
        </ScrollArea>
    </Flex>
  );
}
