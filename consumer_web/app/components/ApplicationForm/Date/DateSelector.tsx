import { Flex, Text } from "@radix-ui/themes";

interface DateSelectorProps {
  requestedDates: string[];
  onClick: () => void;
}

export default function DateSelector({ requestedDates, onClick }: DateSelectorProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="space-y-2">
      <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={onClick}>
        <Text size="2" weight="medium">요청 일자</Text>
        <Text size="2" color="gray">
          {requestedDates.length > 0 ? (
            formatDate(requestedDates[0])
          ) : (
            '선택해주세요'
          )}
        </Text>
      </Flex>
    </div>
  );
}
