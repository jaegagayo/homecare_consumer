import { Flex, Text, Heading, Select } from "@radix-ui/themes";
import { Info } from "lucide-react";
import { SERVICE_TYPES } from "../../../types";

interface ServiceTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ServiceTypeSelector({ value, onChange }: ServiceTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Heading size="3">서비스 유형 *</Heading>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger placeholder="서비스 유형을 선택하세요" className="w-full" />
        <Select.Content>
          {SERVICE_TYPES.filter(service => service.value === 'VISITING_CARE').map((service) => (
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
