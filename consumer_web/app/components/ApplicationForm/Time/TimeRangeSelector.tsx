import { Flex, Text, Heading } from "@radix-ui/themes";

interface TimeRangeSelectorProps {
  startTime: string;
  onStartTimeChange: (time: string) => void;
  onClick: () => void;
}

export default function TimeRangeSelector({ startTime, onStartTimeChange, onClick }: TimeRangeSelectorProps) {
  return (
    <div className="space-y-2">
      <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={onClick}>
        <Text size="2" weight="medium">시작 시간</Text>
        <Text size="2" color="gray">{startTime}</Text>
      </Flex>
    </div>
  );
}
