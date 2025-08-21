import { Text, Card, RadioCards } from "@radix-ui/themes";
import { Caregiver } from "../../types/matching";
import CaregiverCard from "./CaregiverCard";

interface CaregiverListProps {
  caregivers: Caregiver[];
  selectedCaregiverId: string;
  onCaregiverSelect: (id: string) => void;
}

export default function CaregiverList({ 
  caregivers, 
  selectedCaregiverId, 
  onCaregiverSelect 
}: CaregiverListProps) {
  if (caregivers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Text size="3" color="gray">
          조건에 맞는 요양보호사가 없습니다.
        </Text>
        <Text size="2" color="gray" className="mt-2">
          다른 조건으로 다시 검색해보세요.
        </Text>
      </Card>
    );
  }

  return (
    <RadioCards.Root 
      value={selectedCaregiverId} 
      onValueChange={onCaregiverSelect}
      className="space-y-3"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {caregivers.map((caregiver) => (
        <CaregiverCard
          key={caregiver.id}
          caregiver={caregiver}
          isSelected={selectedCaregiverId === caregiver.id}
          onSelect={onCaregiverSelect}
        />
      ))}
    </RadioCards.Root>
  );
}
