import { Dialog, Flex, Text, Button } from "@radix-ui/themes";
import { X } from "lucide-react";

interface DurationSettingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duration: number;
  onDurationChange: (duration: number) => void;
}

export default function DurationSettingDialog({
  open,
  onOpenChange,
  duration,
  onDurationChange
}: DurationSettingDialogProps) {
  const durationOptions = [60, 90, 120, 150, 180, 210, 240];

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}시간${remainingMinutes > 0 ? ` ${remainingMinutes}분` : ''}`;
    }
    return `${minutes}분`;
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Dialog.Title className="flex items-center">1회 소요시간 설정</Dialog.Title>
            <Button
              variant="ghost"
              size="2"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-1 self-center -mt-4"
            >
              <X size={16} />
              <Text size="2" weight="medium">닫기</Text>
            </Button>
          </Flex>
          <Flex direction="column" gap="3">
            <Text size="2" weight="medium" className="mb-2">시간 선택 (30분 단위)</Text>

            <div className="grid grid-cols-3 gap-3">
              {durationOptions.map((minutes) => (
                <button
                  key={minutes}
                  className={`py-3 px-4 rounded-lg text-center cursor-pointer transition-colors ${duration === minutes
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  style={{
                    backgroundColor: duration === minutes
                      ? 'var(--accent-9)'
                      : 'var(--gray-3)'
                  }}
                  onClick={() => onDurationChange(minutes)}
                >
                  <Text size="2" weight="medium">
                    {formatDuration(minutes)}
                  </Text>
                </button>
              ))}
            </div>
          </Flex>

          <Flex gap="3" className="mt-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              확인
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}