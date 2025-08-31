import { Flex, Text, Card } from '@radix-ui/themes';
import { MapPin } from 'lucide-react';
import { ConsumerScheduleDetailResponse } from '../../../types/schedule';

interface VisitLocationCardProps {
  schedule: ConsumerScheduleDetailResponse;
}

export default function VisitLocationCard({ schedule }: VisitLocationCardProps) {

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
            <MapPin size={12} style={{ color: 'white' }} />
          </div>
          <Text size="3" weight="medium">방문 장소</Text>
        </Flex>

        {/* 주소 섹션 */}
        <div className="space-y-2">
          <Text size="2" color="gray" className='block mb-1'>주소</Text>
          <Text size="3" weight="medium">{schedule.serviceAddress}</Text>
        </div>

        <div className="w-full h-px bg-gray-200"></div>

        {/* 출입 방법 섹션 */}
        <div className="space-y-2">
          <Text size="2" color="gray" className='block mb-1'>출입 방법</Text>
          <Text size="3" weight="medium">1층 엘리베이터 이용 후 3층에서 내려서 301호</Text>
        </div>


      </Flex>
    </Card>
  );
}

