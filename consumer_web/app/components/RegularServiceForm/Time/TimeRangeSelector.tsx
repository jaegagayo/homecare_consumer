import { Flex, Text } from "@radix-ui/themes";

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onClick: () => void;
}

export default function TimeRangeSelector({ startTime, endTime, onClick }: TimeRangeSelectorProps) {
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // HH:MM:SS 형식에서 HH:MM 형식으로 변환
    return timeString.substring(0, 5);
  };

  // 소요시간 계산
  const calculateDuration = () => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      const durationInMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      
      if (durationInMinutes > 0) {
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        
        if (hours > 0 && minutes > 0) {
          return `${hours}시간 ${minutes}분`;
        } else if (hours > 0) {
          return `${hours}시간`;
        } else {
          return `${minutes}분`;
        }
      }
    }
    return '';
  };

  const duration = calculateDuration();

  return (
    <div className="space-y-2">
      <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={onClick}>
        <Text size="2" weight="medium">신청 시간</Text>
        <Text size="2" color="gray">
          {formatTime(startTime)} ~ {formatTime(endTime)}
          {duration && <span> ({duration})</span>}
        </Text>
      </Flex>
    </div>
  );
}
