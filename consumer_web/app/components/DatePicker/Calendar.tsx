import { Flex, Text, Button } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { CalendarProps } from "../../types";

export default function Calendar({
  currentMonth,
  dateRange,
  selectionStep,
  weekdayFilter,
  selectedDates,
  onMonthChange,
  onDateSelection,
  onWeekdayToggle,
  onDateToggle
}: CalendarProps) {
  // 로컬 날짜 문자열 생성 (YYYY-MM-DD 형식)
  const toLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDatesBetween = (startStr: string, endStr: string) => {
    const res: string[] = [];
    const start = new Date(startStr);
    const end = new Date(endStr);
    const cur = new Date(start);
    while (cur <= end) {
      res.push(toLocalDateString(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return res;
  };

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

  return (
    <Flex direction="column" gap="3">
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
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <button
              key={day}
              onClick={() => {
                if (selectionStep === 'weekday') {
                  onWeekdayToggle(index);
                }
              }}
              className={`text-center py-2 rounded-lg transition-colors ${
                selectionStep === 'weekday'
                  ? weekdayFilter[index]
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-700'
              }`}
              style={
                selectionStep === 'weekday'
                  ? weekdayFilter[index]
                    ? { backgroundColor: 'var(--accent-9)' }
                    : { backgroundColor: 'var(--gray-3)' }
                  : {}
              }
            >
              <Text size="1" weight="medium">{day}</Text>
            </button>
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
            const dayOfWeek = date.getDay();

            // 범위 선택을 위한 스타일링
            const isStart = dateRange.start === dateString;
            const isEnd = dateRange.end === dateString;
            const hasRange = dateRange.start && dateRange.end;
            const startDate = hasRange ? new Date(dateRange.start!) : null;
            const endDate = hasRange ? new Date(dateRange.end!) : null;
            const isInRange = hasRange && startDate && endDate && 
              date >= (startDate < endDate ? startDate : endDate) && 
              date <= (startDate < endDate ? endDate : startDate);

            // 요일 필터 단계에서의 스타일링
            const isInSelectedRange = hasRange && startDate && endDate && 
              (dateString >= dateRange.start! && dateString <= dateRange.end!);
            const isWeekdayFiltered = selectionStep === 'weekday' && isInSelectedRange && weekdayFilter[dayOfWeek];
            const isDateSelected = selectedDates.has(dateString);

            let cellClass = '';
            let cellStyle = {};

            if (!isCurrentMonth || isPast) {
              cellClass = 'text-gray-300 cursor-not-allowed';
            } else if (selectionStep === 'weekday') {
              // 요일 필터 단계
              if (isStart || isEnd) {
                // 시작일/종료일은 항상 선택된 상태로 표시
                if (isDateSelected) {
                  // 개별 선택된 시작일/종료일 - 활성 상태
                  cellClass = 'text-white';
                  cellStyle = { backgroundColor: 'var(--accent-9)' };
                } else {
                  // 개별 선택되지 않은 시작일/종료일 - 비활성 상태
                  cellClass = 'text-white';
                  cellStyle = { backgroundColor: 'var(--accent-6)' };
                }
              } else if (isInSelectedRange) {
                // 일반 날짜들
                if (isDateSelected) {
                  // 개별 선택된 날짜들
                  cellClass = 'text-accent-11';
                  cellStyle = { backgroundColor: 'var(--accent-4)' };
                } else {
                  // 개별 선택되지 않은 날짜들
                  cellClass = 'text-gray-400';
                  cellStyle = { backgroundColor: 'var(--gray-3)' };
                }
              } else {
                cellClass = 'text-gray-300';
              }
            } else {
              // 날짜 선택 단계
              if (isStart || isEnd) {
                cellClass = 'text-white';
                cellStyle = { backgroundColor: 'var(--accent-9)' };
              } else if (isInRange) {
                cellClass = 'text-accent-11';
                cellStyle = { backgroundColor: 'var(--accent-4)' };
              } else {
                cellClass = 'hover:bg-gray-100';
              }
            }

            return (
              <button
                key={index}
                className={`aspect-square flex items-center justify-center rounded-lg transition-colors ${cellClass}`}
                style={cellStyle}
                onClick={() => {
                  if (isCurrentMonth && !isPast) {
                    if (selectionStep === 'weekday') {
                      // 요일 필터 단계에서는 범위 내 날짜만 클릭 가능
                      if (isInSelectedRange) {
                        onDateToggle(dateString);
                      }
                    } else {
                      // 날짜 선택 단계
                      onDateSelection(dateString);
                    }
                  }
                }}
                disabled={!isCurrentMonth || isPast}
              >
                <Text 
                  size="2" 
                  weight={isToday ? "bold" : "medium"}
                  className={isToday && !isStart && !isEnd && !isWeekdayFiltered && (selectionStep !== 'weekday' || isInSelectedRange) ? "underline" : ""}
                  style={isToday && !isPast && !isStart && !isEnd && !isWeekdayFiltered && (selectionStep !== 'weekday' || isInSelectedRange) ? { color: 'var(--accent-9)' } : {}}
                >
                  {date.getDate()}
                </Text>
              </button>
            );
          })}
        </div>
      </div>
    </Flex>
  );
}
