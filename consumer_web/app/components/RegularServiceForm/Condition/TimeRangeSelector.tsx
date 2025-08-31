import { Flex, Text } from "@radix-ui/themes";

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onClick: () => void;
}

export default function TimeRangeSelector({ startTime, endTime, onClick }: TimeRangeSelectorProps) {
  return (
    <div className="space-y-2">
      <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={onClick}>
        <Text size="2" weight="medium">가능한 시간대</Text>
        <Text size="2" color="gray">{startTime} ~ {endTime}</Text>
      </Flex>
    </div>
  );
}
