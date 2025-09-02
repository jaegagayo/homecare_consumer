import { Flex, Text, Button, Badge } from "@radix-ui/themes";
import { Star } from "lucide-react";
import { Caregiver } from "../../types/matching";

interface SelectedCaregiverInfoProps {
  selectedCaregiver: Caregiver | null;
  onConfirm: () => void;
}

const renderStars = (rating: number) => {
  return (
    <Flex gap="1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? "#fbbf24" : "none"}
          color={star <= rating ? "#fbbf24" : "#d1d5db"}
        />
      ))}
    </Flex>
  );
};

export default function SelectedCaregiverInfo({ 
  selectedCaregiver, 
  onConfirm 
}: SelectedCaregiverInfoProps) {
  if (!selectedCaregiver) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <Flex align="center" justify="between" className="mb-3">
            <Flex align="center" gap="2">
              <Text size="2" weight="medium">선택된 요양보호사</Text>
            </Flex>
            <Badge color="green">선택됨</Badge>
          </Flex>
          <Flex justify="between" align="center" className="mb-4">
            <Flex align="center" gap="2">
              <Text size="3" weight="medium">
                {selectedCaregiver.name}
              </Text>
              <Text size="2" color="gray">
                {selectedCaregiver.gender === 'female' ? '여' : '남'} / {' '}
                {selectedCaregiver.age}세 / {' '}
                경력 {selectedCaregiver.experience}년
              </Text>
            </Flex>
            <Flex align="center" gap="2">
              {renderStars(selectedCaregiver.rating)}
              <Text size="2" color="gray">
                {selectedCaregiver.rating}
              </Text>
            </Flex>
          </Flex>
          <Flex gap="3">
            <Button 
              variant="outline"
              className="flex-1" 
              size="3"
              onClick={() => {
                // TODO: 리뷰 보기 다이얼로그 열기
                console.log('리뷰 보기:', selectedCaregiver.caregiverId);
              }}
            >
              리뷰 보기
            </Button>
            <Button 
              className="flex-1" 
              size="3"
              onClick={onConfirm}
            >
              신청 확정하기
            </Button>
          </Flex>
        </div>
      </div>
    </div>
  );
}
