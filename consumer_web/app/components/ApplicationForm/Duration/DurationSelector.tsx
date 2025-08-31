import { Flex, Text } from "@radix-ui/themes";

interface DurationSelectorProps {
  duration: number;
  onClick: () => void;
}

export default function DurationSelector({ duration, onClick }: DurationSelectorProps) {
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}시간${remainingMinutes > 0 ? ` ${remainingMinutes}분` : ''}`;
    }
    return `${minutes}분`;
  };

  return (
    <div className="space-y-2">
      <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={onClick}>
        <Text size="2" weight="medium">1회 소요시간</Text>
        <Text size="2" color="gray">{formatDuration(duration)}</Text>
      </Flex>
    </div>
  );
}
