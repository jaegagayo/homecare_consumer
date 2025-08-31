import { Flex, Text } from "@radix-ui/themes";

interface DateRangeSelectorProps {
  requestedDates: string[];
  onClick: () => void;
}

export default function DateRangeSelector({ requestedDates, onClick }: DateRangeSelectorProps) {
  const formatDateRange = (dates: string[]) => {
    if (dates.length >= 2) {
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[dates.length - 1]);
      return `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일 ~ ${endDate.getFullYear()}년 ${endDate.getMonth() + 1}월 ${endDate.getDate()}일`;
    }
    return '선택해주세요';
  };

  return (
    <div className="space-y-2">
      <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={onClick}>
        <Text size="2" weight="medium">서비스 기간</Text>
        <Text size="2" color="gray">
          {formatDateRange(requestedDates)}
        </Text>
      </Flex>
    </div>
  );
}
