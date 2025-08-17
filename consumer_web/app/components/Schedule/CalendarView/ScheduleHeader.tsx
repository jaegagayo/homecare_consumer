import { Flex, Text, Button } from '@radix-ui/themes';
import { Schedule } from '../../../types/schedule';

interface ScheduleHeaderProps {
  currentWeek: Date;
  schedules: Schedule[];
  onNavigateWeek: (direction: 'prev' | 'next' | 'today') => void;
}

export default function ScheduleHeader({ currentWeek, schedules, onNavigateWeek }: ScheduleHeaderProps) {
  // 주간 날짜 배열 생성
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay()); // 일요일부터 시작
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const start = startDate.getDate();
    const end = endDate.getDate();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    if (startYear === endYear && startMonth === endMonth) {
      return `${startYear}년 ${startMonth}월 ${start}일 ~ ${end}일`;
    } else if (startYear === endYear) {
      return `${startYear}년 ${startMonth}월 ${start}일 ~ ${endMonth}월 ${end}일`;
    } else {
      return `${startYear}년 ${startMonth}월 ${start}일 ~ ${endYear}년 ${endMonth}월 ${end}일`;
    }
  };

  const weekDates = getWeekDates(currentWeek);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  // 현재 주의 일정들만 필터링
  const currentWeekSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return scheduleDate >= weekStart && scheduleDate <= weekEnd;
  });

  // 통계 계산
  const upcomingCount = currentWeekSchedules.filter(s => s.status === 'upcoming').length;
  const completedCount = currentWeekSchedules.filter(s => s.status === 'completed').length;
  const totalEarnings = currentWeekSchedules
    .filter(s => s.status === 'completed')
    .reduce((total, s) => total + (s.duration * s.hourlyRate), 0);

  return (
    <Flex direction="column" gap="3" style={{ flexShrink: 0, marginBottom: '16px' }}>
      {/* 날짜 범위와 네비게이션 */}
      <Flex justify="between" align="center">
        <Text size="5" weight="bold">
          {formatDateRange(weekStart, weekEnd)}
        </Text>
        <Flex align="center" gap="2">
          <Button onClick={() => onNavigateWeek('prev')} variant="ghost" size="2">{'<'}</Button>
          <Button onClick={() => onNavigateWeek('today')} variant="soft" size="2">오늘</Button>
          <Button onClick={() => onNavigateWeek('next')} variant="ghost" size="2">{'>'}</Button>
        </Flex>
      </Flex>



      {/* 통계 정보 */}
      <Flex align="center" justify="between">
        {/* 일정 현황 */}
        <div className="flex-1">
          <Flex align="center" justify="between">
            <Text size="2" color="gray">일정</Text>
            <Text size="4" weight="bold">
              {currentWeekSchedules.length}건 중 <span style={{ color: 'var(--accent-9)' }}>{completedCount}건</span> 완료
            </Text>
          </Flex>
        </div>
        
        {/* 세로 구분선 */}
        <div className="w-px h-6 bg-gray-300 mx-4"></div>
        
        {/* 해당 주 수익 */}
        <div className="flex-1">
          <Flex align="center" justify="between">
            <Text size="2" color="gray">수익</Text>
            <Text size="4" weight="bold">
              ₩{totalEarnings.toLocaleString()}
            </Text>
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
}
