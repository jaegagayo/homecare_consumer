import { Dialog, Flex, Text, Button, Select } from "@radix-ui/themes";
import { X } from "lucide-react";
import { TIME_SLOTS } from "../../../types";

interface TimeSettingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startTime: string;
  onStartTimeChange: (time: string) => void;
}

export default function TimeSettingDialog({
  open,
  onOpenChange,
  startTime,
  onStartTimeChange
}: TimeSettingDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Dialog.Title className="flex items-center">시작 시간 설정</Dialog.Title>
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
            <Text size="2" weight="medium" className="mb-2">시작 시간 선택</Text>

            <Flex gap="3" align="center" justify="center">
              <Select.Root
                value={startTime}
                onValueChange={onStartTimeChange}
              >
                <Select.Trigger className="h-10 text-lg px-6" />
                <Select.Content>
                  {TIME_SLOTS.map((time) => (
                    <Select.Item key={time} value={time}>{time}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Text size="2" color="gray">부터 시작</Text>
            </Flex>
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
