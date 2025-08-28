import { Flex, Text, Button } from '@radix-ui/themes';

interface ScheduleHeaderProps {
  currentWeek: Date;
  currentDayIndex: number;
  onNavigateWeek: (direction: 'prev' | 'next' | 'today') => void;
  onNavigateDays: (direction: 'prev' | 'next' | number) => void;
}

export default function ScheduleHeader({ currentWeek, currentDayIndex, onNavigateWeek, onNavigateDays }: ScheduleHeaderProps) {
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





  return (
    <Flex direction="column" gap="3" style={{ flexShrink: 0, marginBottom: '16px', paddingTop: '4px' }}>
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

      {/* 3일 인디케이터 */}
      <Flex justify="center" align="center" gap="2">
        <Button 
          onClick={() => onNavigateDays('prev')} 
          variant="ghost" 
          size="2"
          disabled={currentDayIndex === 0}
        >
          ◀
        </Button>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, idx) => (
            <button
              key={idx}
              className={`py-2 px-3 rounded-full text-center cursor-pointer transition-colors ${
                idx >= currentDayIndex && idx < currentDayIndex + 3
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: idx >= currentDayIndex && idx < currentDayIndex + 3
                  ? 'var(--accent-9)'
                  : 'var(--gray-3)'
              }}
              onClick={() => {
                // 해당 요일이 3일 중 가운데로 오도록 이동
                let targetIndex;
                if (idx <= 1) {
                  // 일(0), 월(1)은 0-2일 (0,1,2)
                  targetIndex = 0;
                } else if (idx >= 5) {
                  // 금(5), 토(6)는 4-6일 (4,5,6)
                  targetIndex = 4;
                } else {
                  // 화(2), 수(3), 목(4)은 각각 가운데
                  // 화(2) → 1-3일 (targetIndex = 1)
                  // 수(3) → 2-4일 (targetIndex = 2)  
                  // 목(4) → 3-5일 (targetIndex = 3)
                  targetIndex = idx - 1;
                }

                onNavigateDays(targetIndex);
              }}
            >
              <Text size="2" weight="medium">{['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}</Text>
            </button>
          ))}
        </div>
        <Button 
          onClick={() => onNavigateDays('next')} 
          variant="ghost" 
          size="2"
          disabled={currentDayIndex === 4}
        >
          ▶
        </Button>
      </Flex>


    </Flex>
  );
}
