import { Flex, Text, Card } from '@radix-ui/themes';
import { Repeat } from 'lucide-react';
import { Schedule } from '../../../types/schedule';

interface RegularScheduleCardProps {
  schedule: Schedule;
}

export default function RegularScheduleCard({ schedule }: RegularScheduleCardProps) {
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return weekdays[date.getDay()];
  };

  // 정기 일정이 아닌 경우 null 반환
  if (!schedule.isRegular || !schedule.regularSequence) {
    return null;
  }

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
            <Repeat size={12} style={{ color: 'white' }} />
          </div>
          <Text size="3" weight="medium">정기 일정 정보</Text>
        </Flex>

        {/* 정기 일정 패턴 */}
        <div className="space-y-2">
          <Text size="2" color="gray" className='block mb-1'>정기 일정 패턴</Text>
          <Text size="3" weight="medium">
            매주 {getDayOfWeek(schedule.date)} {schedule.time}
          </Text>
        </div>

        <div className="w-full h-px bg-gray-200"></div>

        {/* 진행 상황 */}
        <div className="space-y-2">
          <Text size="2" color="gray" className='block mb-1'>진행 상황</Text>
          <Text size="3" weight="medium">
            총 {schedule.regularSequence.total}회 중 {schedule.regularSequence.current}회차 ({schedule.regularSequence.total - schedule.regularSequence.current}회 남음)
          </Text>
        </div>


      </Flex>
    </Card>
  );
}
