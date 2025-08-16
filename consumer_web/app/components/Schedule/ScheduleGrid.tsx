import { Flex } from '@radix-ui/themes';
import { useState, useRef, forwardRef } from 'react';
import ScheduleHeader from './ScheduleHeader';
import ScheduleGridBody from './ScheduleGridBody';

interface Schedule {
  id: string;
  date: string;
  time: string;
  clientName: string;
  address: string;
  serviceType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number;
  hourlyRate: number;
}

interface ScheduleGridProps {
  schedules: Schedule[];
}

const ScheduleGrid = forwardRef<HTMLDivElement, ScheduleGridProps>(({ schedules }, ref) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const gridRef = useRef<HTMLDivElement>(null);

  // ref를 gridRef와 연결
  const handleRef = (element: HTMLDivElement | null) => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  };

  const navigateWeek = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentWeek(new Date());
    } else {
      const newWeek = new Date(currentWeek);
      newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeek(newWeek);
    }
  };

  return (
    <Flex direction="column" style={{ flex: 1, height: '100%' }}>
      {/* 헤더 */}
      <ScheduleHeader 
        currentWeek={currentWeek} 
        schedules={schedules}
        onNavigateWeek={navigateWeek} 
      />

      {/* 스케줄 그리드 */}
      <ScheduleGridBody 
        ref={handleRef}
        schedules={schedules} 
        currentWeek={currentWeek} 
      />
    </Flex>
  );
});

ScheduleGrid.displayName = 'ScheduleGrid';

export default ScheduleGrid;
