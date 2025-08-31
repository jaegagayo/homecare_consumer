import { Flex, Text, Heading, Select } from "@radix-ui/themes";
import { Info } from "lucide-react";

interface ServiceType {
  value: string;
  label: string;
  description: string;
}

interface ServiceTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const serviceTypes: ServiceType[] = [
  { value: 'VISITING_CARE', label: '방문요양서비스', description: '가정을 방문하여 일상생활 지원' },
  { value: 'DAY_NIGHT_CARE', label: '주야간보호서비스', description: '주간 또는 야간 보호 서비스' },
  { value: 'RESPITE_CARE', label: '단기보호서비스', description: '일시적인 보호 서비스' },
  { value: 'VISITING_BATH', label: '방문목욕서비스', description: '가정 방문 목욕 서비스' },
  { value: 'IN_HOME_SUPPORT', label: '재가노인지원서비스', description: '재가 노인을 위한 종합 지원' },
  { value: 'VISITING_NURSING', label: '방문간호서비스', description: '전문 간호 서비스' },
];

export default function ServiceTypeSelector({ value, onChange }: ServiceTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Heading size="3">서비스 유형 *</Heading>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger placeholder="서비스 유형을 선택하세요" className="w-full" />
        <Select.Content>
          {serviceTypes.filter(service => service.value === 'VISITING_CARE').map((service) => (
            <Select.Item key={service.value} value={service.value}>
              {service.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* 추후 서비스 안내 */}
      <Flex align="center" gap="2">
        <Info size={24} style={{ color: 'var(--accent-10)' }} />
        <Text size="1" style={{ color: 'var(--accent-10)' }}>
          주야간보호, 단기보호, 방문목욕, 재가노인지원, 방문간호 서비스는 준비 중입니다.
          빠른 시일 내에 서비스를 제공할 예정입니다.
        </Text>
      </Flex>
    </div>
  );
}
