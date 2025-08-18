import { useState } from "react";
import { 
  Dialog,
  Flex, 
  Text, 
  Button,
  Heading,
  Card
} from "@radix-ui/themes";
import { 
  X
} from "lucide-react";

interface BlacklistRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caregiverName: string;
  serviceType: string;
  serviceDate: string;
  serviceTime: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function BlacklistRegistrationDialog({
  open,
  onOpenChange,
  caregiverName,
  serviceType,
  serviceDate,
  serviceTime,
  onConfirm,
  onCancel
}: BlacklistRegistrationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Dialog.Title className="flex items-center">블랙리스트 등록</Dialog.Title>
            <Button
              variant="ghost"
              size="2"
              onClick={handleCancel}
              className="flex items-center gap-1 self-center -mt-4"
            >
              <X size={16} />
              <Text size="2" weight="medium">닫기</Text>
            </Button>
          </Flex>

          {/* 안내 문구 */}
          <Text size="3" color="gray">
            이 보호사를 블랙리스트에 추가하시겠습니까?<br/>
            (나중에 마이페이지에서 해제 가능)
          </Text>
          

          {/* 보조 문구 */}
          <Card className="p-3 bg-red-100">
            <Text size="2" color="red" className="leading-relaxed">
              블랙리스트 등록 시,<br/>
              해당 보호사는 향후 매칭 대상에서 제외됩니다.
            </Text>
          </Card>

          {/* 보호사 요약 정보 */}
          <Card className="p-4">
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium" color="gray">서비스 정보</Text>
              <Text size="3" weight="medium">{caregiverName} 요양보호사</Text>
              <Text size="2" color="gray">
                {formatDate(serviceDate)} {serviceTime}, {serviceType}
              </Text>
            </Flex>
          </Card>

          {/* CTA 버튼 */}
          <Flex gap="3" className="mt-4">
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              등록하지 않음
            </Button>
            <Button 
              variant="solid"
              color="red"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? '등록 중...' : '블랙리스트 등록'}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
