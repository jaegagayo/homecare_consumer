import { Flex, Text, Card } from '@radix-ui/themes';
import { CreditCard } from 'lucide-react';
import { ConsumerScheduleDetailResponse } from '../../../types/schedule';

interface PaymentInfoCardProps {
  schedule: ConsumerScheduleDetailResponse;
}

export default function PaymentInfoCard({ schedule }: PaymentInfoCardProps) {
  return (
    <Card className="p-4">
      <Flex direction="column" gap="4">
        {/* 헤더 */}
        <Flex align="center" gap="2">
          <div 
            style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: 'var(--accent-9)', 
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CreditCard size={12} style={{ color: 'white' }} />
          </div>
          <Text size="3" weight="medium">결제 정보</Text>
        </Flex>

        {/* 시간당 요금 및 서비스 시간 */}
        <div>
          <Flex justify="between" align="center" className="mb-2">
            <Text size="2" weight="medium">시간당 요금</Text>
            <Text size="2" weight="medium">₩15,000</Text>
          </Flex>
          <Flex justify="between" align="center">
            <Text size="2" weight="medium">서비스 시간</Text>
            <Text size="2" weight="medium">{schedule.duration}시간</Text>
          </Flex>
        </div>

        <div className="w-full h-px bg-gray-200"></div>

        {/* 총 금액 */}
        <Flex justify="between" align="center">
          <Text size="3" weight="medium">총 금액</Text>
          <Text size="4" weight="bold" style={{ color: 'var(--accent-9)' }}>
            ₩{(15000 * schedule.duration).toLocaleString()}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
