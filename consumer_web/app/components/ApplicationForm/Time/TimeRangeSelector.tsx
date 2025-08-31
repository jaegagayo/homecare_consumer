import { Flex, Text, Heading } from "@radix-ui/themes";

interface TimeRangeSelectorProps {
  startTime: string;
  onStartTimeChange: (time: string) => void;
  onClick: () => void;
}

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

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
