import { Flex, Text } from "@radix-ui/themes";

interface DurationSelectorProps {
  duration: number;
  onClick: () => void;
}

export default function DurationSelector({ duration, onClick }: DurationSelectorProps) {
  return (
    <div className="space-y-2">
      <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={onClick}>
        <Text size="2" weight="medium">1회 소요시간</Text>
        <Text size="2" color="gray">{duration}시간</Text>
      </Flex>
    </div>
  );
}
