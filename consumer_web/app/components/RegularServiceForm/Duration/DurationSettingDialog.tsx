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
  const durationOptions = [1, 2, 3, 4];

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
            <Text size="2" weight="medium" className="mb-2">시간 선택</Text>

            <div className="grid grid-cols-2 gap-4">
              {durationOptions.map((hour) => (
                <button
                  key={hour}
                  className={`py-3 px-6 rounded-full text-center cursor-pointer transition-colors ${duration === hour
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  style={{
                    backgroundColor: duration === hour
                      ? 'var(--accent-9)'
                      : 'var(--gray-3)'
                  }}
                  onClick={() => onDurationChange(hour)}
                >
                  <Text size="2" weight="medium">{hour}시간</Text>
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
