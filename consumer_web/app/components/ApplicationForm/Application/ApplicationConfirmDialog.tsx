import { Dialog, Flex, Text, Button, Badge } from "@radix-ui/themes";
import { X } from "lucide-react";

interface ApplicationForm {
  serviceType: string;
  address: string;
  specialRequests: string;
  estimatedUsage: number;
  duration: number;
  requestedDates: string[];
  startTime: string;
  preferredAreas: string[];
}

interface ApplicationConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ApplicationForm;
  onConfirm: () => void;
  onEdit: () => void;
}

export default function ApplicationConfirmDialog({
  open,
  onOpenChange,
  form,
  onConfirm,
  onEdit
}: ApplicationConfirmDialogProps) {
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
      <Dialog.Content className="max-w-md">
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Dialog.Title className="flex items-center">신청서 확인</Dialog.Title>
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

          {/* 안내 멘트 */}
          <Text size="3" color="gray">
            작성하신 신청서를 검토해 주세요.<br />수정이 필요하다면 수정하기를 눌러주세요.
          </Text>

          {/* 신청서 내용 카드 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <Flex direction="column" gap="4">
              {/* 서비스 유형 및 기간 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 유형</Text>
                  <Badge color="blue">
                    {form.serviceType === 'visiting-care' ? '방문요양서비스' : form.serviceType}
                  </Badge>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 날짜 및 시간 */}
              <div>
                <Flex justify="between" align="center" className="mb-4">
                  <Text size="2" weight="medium">서비스 날짜</Text>
                  <Text size="2" color="gray">
                    {form.requestedDates.length > 0 ? (
                      (() => {
                        const selectedDate = form.requestedDates[0];
                        const date = new Date(selectedDate);
                        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
                      })()
                    ) : (
                      '선택되지 않음'
                    )}
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 시간</Text>
                  <Text size="2" color="gray">
                    {form.startTime}부터 {formatDuration(form.duration)}
                  </Text>
                </Flex>
                <Flex justify="between" align="center" className="mt-4">
                  <Text size="2" weight="medium">1회 소요시간</Text>
                  <Text size="2" color="gray">
                    {formatDuration(form.duration)}
                  </Text>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 주소 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 주소</Text>
                  <Text size="2">{form.address}</Text>
                </Flex>
              </div>

              {/* 특별 요청사항이 있는 경우에만 표시 */}
              {form.specialRequests && (
                <>
                  <div className="w-full h-px bg-gray-200"></div>
                  <div>
                    <div><Text size="2" weight="medium" className="mb-3">특별 요청사항</Text></div>
                    <div><Text size="2" className="leading-relaxed whitespace-pre-line">{form.specialRequests}</Text></div>
                  </div>
                </>
              )}
            </Flex>
          </div>

          {/* 버튼 */}
          <Flex gap="3" className="mt-4">
            <Button
              variant="outline"
              onClick={onEdit}
              className="flex-1"
            >
              수정하기
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1"
            >
              후보 보기
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}