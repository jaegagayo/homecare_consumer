import { Flex, Text } from "@radix-ui/themes";
import { StepHeaderProps } from "../../types";

export default function StepHeader({
  selectionStep,
  dateRange,
  selectedDates,
  onStepClick,
  mode
}: StepHeaderProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getDatesBetween = (startStr: string, endStr: string) => {
    const res: string[] = [];
    const start = new Date(startStr);
    const end = new Date(endStr);
    const cur = new Date(start);
    while (cur <= end) {
      res.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return res;
  };

  const totalDates = dateRange.start && dateRange.end 
    ? getDatesBetween(dateRange.start, dateRange.end).length 
    : 0;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <Flex justify="between" align="center" className="mb-3">
        <Text size="2" weight="medium" color="gray">
          {mode === 'range' ? '단계별 설정' : '날짜 선택'}
        </Text>
        <Text size="1" color="gray">
          {mode === 'range' ? (
            <>
              {selectionStep === 'start' && '1/3'}
              {selectionStep === 'end' && '2/3'}
              {selectionStep === 'weekday' && '3/3'}
            </>
          ) : (
            '1/1'
          )}
        </Text>
      </Flex>
      
      {mode === 'range' ? (
        <Flex gap="2" className="mb-3">
          <button
            onClick={() => onStepClick('start')}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors ${
              selectionStep === 'start' 
                ? 'text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            style={selectionStep === 'start' ? { backgroundColor: 'var(--accent-9)' } : {}}
          >
            <Text size="2" weight="medium">시작일</Text>
            {dateRange.start && (
              <Text size="1" className="block mt-1 opacity-80">
                {formatDate(dateRange.start)}
              </Text>
            )}
          </button>
          
          <button
            onClick={() => onStepClick('end')}
            disabled={!dateRange.start}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors ${
              !dateRange.start 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : selectionStep === 'end'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            style={!dateRange.start ? {} : selectionStep === 'end' ? { backgroundColor: 'var(--accent-9)' } : {}}
          >
            <Text size="2" weight="medium">종료일</Text>
            {dateRange.end && (
              <Text size="1" className="block mt-1 opacity-80">
                {formatDate(dateRange.end)}
              </Text>
            )}
          </button>
          
          <button
            onClick={() => onStepClick('weekday')}
            disabled={!dateRange.start || !dateRange.end}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors ${
              !dateRange.start || !dateRange.end
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : selectionStep === 'weekday'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            style={(!dateRange.start || !dateRange.end) ? {} : selectionStep === 'weekday' ? { backgroundColor: 'var(--accent-9)' } : {}}
          >
            <Text size="2" weight="medium">제외 날짜</Text>
            {totalDates > 0 && selectedDates.size < totalDates && (
              <Text size="1" className="block mt-1 opacity-80">
                {totalDates - selectedDates.size}일 제외
              </Text>
            )}
          </button>
        </Flex>
      ) : (
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
          <Text size="2" weight="medium" className="text-center">
            {selectedDates.size > 0 ? (
              <>
                선택된 날짜: {Array.from(selectedDates).map(date => formatDate(date)).join(', ')}
              </>
            ) : (
              '날짜를 선택해주세요'
            )}
          </Text>
        </div>
      )}

      {/* 현재 단계 안내 */}
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <Text size="2" color="gray">
          {mode === 'range' ? (
            <>
              {selectionStep === 'start' && '시작일을 선택해주세요'}
              {selectionStep === 'end' && '종료일을 선택해주세요'}
              {selectionStep === 'weekday' && '제외할 날짜를 선택해주세요. 요일 헤더를 터치하거나 개별 날짜를 터치할 수 있습니다.'}
            </>
          ) : (
            '원하는 날짜를 선택해주세요'
          )}
        </Text>
      </div>
    </div>
  );
}
