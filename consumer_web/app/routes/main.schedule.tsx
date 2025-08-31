import { useState, useEffect } from "react";
import { 
  Container, 
  Flex, 
  Text
} from "@radix-ui/themes";
import { ViewToggle } from "../components/Schedule";
import { ScheduleHeader, ScheduleGridBody } from "../components/Schedule/CalendarView";
import { ScheduleListView } from "../components/Schedule/ListView";
import { ConsumerScheduleResponse } from "../types/schedule";
import { getConsumerSchedule } from "../api/schedule";
import { getStoredConsumerId } from "../api/auth";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ConsumerScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    // 오늘 날짜가 가운데로 오도록 초기 인덱스 설정
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    
    // 오늘 날짜가 3일 중 가운데로 오도록 계산
    if (dayOfWeek <= 1) {
      return 0; // 일(0), 월(1)은 0-2일 (0,1,2)
    } else if (dayOfWeek >= 5) {
      return 4; // 금(5), 토(6)는 4-6일 (4,5,6)
    } else {
      return dayOfWeek - 1; // 화(2), 수(3), 목(4)은 각각 가운데
    }
  }); // 현재 표시할 3일의 시작 인덱스

  useEffect(() => {
    // API 데이터 로드
    const loadData = async () => {
      try {
        const consumerId = getStoredConsumerId();
        if (!consumerId) {
          throw new Error('Consumer ID not found');
        }

        // 주간 일정 조회 API 호출
        const scheduleData = await getConsumerSchedule(consumerId);
        setSchedules(scheduleData);
      } catch (error) {
        console.error('Failed to load schedule data:', error);
        // 에러 시 빈 배열로 설정
        setSchedules([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const navigateWeek = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentWeek(new Date());
      setCurrentDayIndex(0); // 오늘 날짜로 이동 시 첫 번째 3일로 설정
    } else {
      const newWeek = new Date(currentWeek);
      newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeek(newWeek);
      setCurrentDayIndex(0); // 주가 바뀌면 첫 번째 3일로 설정
    }
  };

  const navigateDays = (direction: 'prev' | 'next' | number) => {
    if (typeof direction === 'number') {
      // 특정 인덱스로 직접 이동
      setCurrentDayIndex(Math.max(0, Math.min(4, direction)));
    } else {
      // prev/next 이동
      if (direction === 'prev' && currentDayIndex > 0) {
        setCurrentDayIndex(currentDayIndex - 1);
      } else if (direction === 'next' && currentDayIndex < 4) { // 0-4 (총 5개 3일 조합)
        setCurrentDayIndex(currentDayIndex + 1);
      }
    }
  };

  if (isLoading) {
    return (
      <Container size="2" className="p-4">
        <Text>로딩 중...</Text>
      </Container>
    );
  }

  return (
    <Container size="2" style={{ 
      height: currentView === 'calendar' ? '80vh' : 'auto',
      overflow: currentView === 'calendar' ? 'hidden' : 'visible',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingBottom: '16px'
    }}>
      <Flex direction="column" style={{ height: currentView === 'calendar' ? '100%' : 'auto' }}>
        {/* 뷰 전환 토글 - 가장 상단 */}
        <ViewToggle 
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* 뷰에 따른 스케줄 표시 */}
        {currentView === 'calendar' ? (
          <>
            {/* 캘린더 뷰 헤더 */}
            <ScheduleHeader 
              currentWeek={currentWeek} 
              currentDayIndex={currentDayIndex}
              onNavigateWeek={navigateWeek}
              onNavigateDays={navigateDays}
            />
            <ScheduleGridBody 
              schedules={schedules} 
              currentWeek={currentWeek} 
              currentDayIndex={currentDayIndex}
              onDayIndexChange={setCurrentDayIndex}
            />
          </>
        ) : (
          <ScheduleListView 
            schedules={schedules} 
          />
        )}
      </Flex>
    </Container>
  );
}
