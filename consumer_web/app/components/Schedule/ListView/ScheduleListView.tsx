import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { Flex, Text, Badge, Card, Button } from '@radix-ui/themes';

import { Schedule } from '../../../types/schedule';

interface ScheduleListViewProps {
  schedules: Schedule[];
}

export default function ScheduleListView({ schedules }: ScheduleListViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<'scheduled-all' | 'scheduled-regular' | 'completed'>('scheduled-all');
  const navigate = useNavigate();



  // 필터별 일정 분류
  const getFilteredSchedules = () => {
    const now = new Date(); // 현재 시간까지 포함
    
    switch (selectedFilter) {
      case 'scheduled-all':
        return schedules.filter(s => {
          const scheduleDateTime = new Date(`${s.date} ${s.time.split(' - ')[0]}`); // 시작 시간
          return (s.status === 'upcoming' || s.status === 'pending_approval') && scheduleDateTime > now;
        });
      case 'scheduled-regular':
        return schedules.filter(s => {
          const scheduleDateTime = new Date(`${s.date} ${s.time.split(' - ')[0]}`); // 시작 시간
          return (s.status === 'upcoming' || s.status === 'pending_approval') && s.isRegular && scheduleDateTime > now;
        });
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



  const handleScheduleClick = (schedule: Schedule) => {
    navigate(`/main/schedule-detail?id=${schedule.id}`);
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
          예정-전체 ({schedules.filter(s => {
            const now = new Date();
            const scheduleDateTime = new Date(`${s.date} ${s.time.split(' - ')[0]}`);
            return (s.status === 'upcoming' || s.status === 'pending_approval') && scheduleDateTime > now;
          }).length})
        </Button>
        <Button 
          variant={selectedFilter === 'scheduled-regular' ? 'solid' : 'ghost'} 
          size="2"
          onClick={() => setSelectedFilter('scheduled-regular')}
        >
          예정-정기 ({schedules.filter(s => {
            const now = new Date();
            const scheduleDateTime = new Date(`${s.date} ${s.time.split(' - ')[0]}`);
            return (s.status === 'upcoming' || s.status === 'pending_approval') && s.isRegular && scheduleDateTime > now;
          }).length})
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
        <div style={{ height: 'calc(100vh - 300px)', overflow: 'auto' }}>
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
                  className="p-4 cursor-pointer transition-all duration-200"
                  onClick={() => handleScheduleClick(schedule)}
                >
                  <Flex direction="column" gap="4">
                    {/* 기본 정보 */}
                    <Flex justify="between" align="center">
                      <Flex direction="column" gap="1">
                        <Text 
                          size="3" 
                          weight="medium"
                        >
                          {formatDateTime(schedule.date, schedule.time)}
                        </Text>
                        <Text size="2" color="gray">
                          {schedule.address}
                        </Text>
                      </Flex>
                      <Flex direction="column" gap="1" align="end">
                        <Badge 
                          color={getStatusColor(schedule.status) as 'orange' | 'blue' | 'green' | 'red' | 'gray'}
                          variant="soft"
                          size="1"
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

                    <div className="w-full h-px bg-gray-200"></div>
                    
                    {/* 상세 정보 - 2열 레이아웃 */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* 왼쪽 열 */}
                      <div className="space-y-3">
                        {/* 요양보호사 정보 */}
                        <div>
                          <Flex justify="between" align="center">
                            <Text size="2" weight="medium">요양보호사</Text>
                            <Text size="2" color="gray">{schedule.caregiverName}</Text>
                    </Flex>
                        </div>

                        <div className="w-full h-px bg-gray-200"></div>

                    {/* 서비스 타입 */}
                        <div>
                          <Flex justify="between" align="center">
                            <Text size="2" weight="medium">서비스 타입</Text>
                            <Badge color="blue">{schedule.serviceType}</Badge>
                          </Flex>
                        </div>
                      </div>

                      {/* 오른쪽 열 */}
                      <div className="space-y-3">
                        {/* 시급 */}
                        <div>
                          <Flex justify="between" align="center">
                            <Text size="2" weight="medium">시급</Text>
                            <Text size="2" color="gray">₩{schedule.hourlyRate.toLocaleString()}</Text>
                          </Flex>
                        </div>

                        <div className="w-full h-px bg-gray-200"></div>

                        {/* 총 금액 */}
                        <div>
                          <Flex justify="between" align="center">
                            <Text size="2" weight="medium">총 금액</Text>
                            <Text size="2" weight="medium" color="blue">
                              ₩{(schedule.hourlyRate * schedule.duration).toLocaleString()}
                    </Text>
                          </Flex>
                        </div>
                      </div>
                    </div>


                  </Flex>
                </Card>
              ))
            )}
          </Flex>
        </div>
    </Flex>
  );
}
