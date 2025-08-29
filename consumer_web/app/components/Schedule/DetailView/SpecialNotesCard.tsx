import { Flex, Text, Card } from '@radix-ui/themes';
import { MessageSquare } from 'lucide-react';
import { Schedule } from '../../../types/schedule';

interface SpecialNotesCardProps {
  schedule: Schedule;
}

export default function SpecialNotesCard({ schedule }: SpecialNotesCardProps) {
  return (
    <Card className="p-4">
      <Flex direction="column" gap="3">
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
            <MessageSquare size={12} style={{ color: 'white' }} />
          </div>
          <Text size="3" weight="medium">특이사항</Text>
        </Flex>

        {/* 특이사항 내용 */}
        <div
          style={{
            backgroundColor: 'var(--gray-3)',
            borderRadius: '8px',
            padding: '12px'
          }}
        >
          <Text size="2" className="whitespace-pre-wrap" style={{ lineHeight: '1.5' }}>
            고객님께서 계단이 있는 3층에 거주하고 계십니다. 엘리베이터는 1층에만 있어서 2-3층은 계단을 이용해야 합니다. 고객님은 보행기 사용이 필요하시며, 화장실은 복도 끝에 위치해 있습니다. 방문 시에는 반드시 신발을 벗고 들어가시기 바랍니다.
          </Text>
        </div>
      </Flex>
    </Card>
  );
}
