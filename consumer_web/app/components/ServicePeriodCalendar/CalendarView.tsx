import { Flex, Text, Button } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { CalendarViewProps } from "../../types";

export default function CalendarView({
  currentMonth,
  requestedDates,
  onMonthChange
}: CalendarViewProps) {
  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    onMonthChange(newMonth);
  };

  // 로컬 날짜 문자열 생성 (YYYY-MM-DD 형식)
  const toLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* 년월 표시 */}
      <div className="flex items-center justify-center gap-8 mb-4">
        <Button 
          variant="ghost" 
          size="3"
          onClick={handlePrevMonth}
          className="p-3"
        >
          <ChevronLeftIcon width={20} height={20} />
        </Button>
        <Text size="3" weight="medium">
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </Text>
        <Button 
          variant="ghost" 
          size="3"
          onClick={handleNextMonth}
          className="p-3"
        >
          <ChevronRightIcon width={20} height={20} />
        </Button>
      </div>

      {/* 캘린더 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="text-center py-2">
            <Text size="1" weight="medium">{day}</Text>
          </div>
        ))}
      </div>

      {/* 캘린더 바디 */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }, (_, index) => {
          const date = new Date(currentMonth);
          date.setDate(1);
          date.setDate(date.getDate() + index - date.getDay());

          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const isPast = date < new Date();
          const dateString = toLocalDateString(date);
          
          // 범위 선택을 위한 스타일링
          const sortedDates = [...requestedDates].sort();
          const startDate = sortedDates[0];
          const endDate = sortedDates[sortedDates.length - 1];
          const isStart = startDate === dateString;
          const isEnd = endDate === dateString;
          const isInRange = startDate && endDate && 
            dateString >= startDate && dateString <= endDate;
          const isSelected = requestedDates.includes(dateString);
          
          let cellClass = '';
          let cellStyle = {};

          if (!isCurrentMonth || isPast) {
            cellClass = 'text-gray-300';
          } else if (isStart || isEnd) {
            // 시작일/종료일 - 진한 색
            cellClass = 'text-white';
            cellStyle = { backgroundColor: 'var(--accent-9)' };
          } else if (isInRange && isSelected) {
            // 중간 날짜 - 연한 녹색
            cellClass = 'text-accent-11';
            cellStyle = { backgroundColor: 'var(--accent-4)' };
          } else {
            cellClass = 'text-gray-700';
          }

          return (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center rounded-lg ${cellClass}`}
              style={cellStyle}
            >
              <Text 
                size="2" 
                weight={isToday ? "bold" : "medium"}
                className={isToday && !isStart && !isEnd && !isInRange ? "underline" : ""}
                style={isToday && !isPast && !isStart && !isEnd && !isInRange ? { color: 'var(--accent-9)' } : {}}
              >
                {date.getDate()}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
