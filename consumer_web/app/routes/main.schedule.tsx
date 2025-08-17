import { useState, useEffect } from "react";
import { 
  Container, 
  Flex, 
  Text
} from "@radix-ui/themes";
import { ViewToggle } from "../components/Schedule";
import { ScheduleHeader, ScheduleGridBody } from "../components/Schedule/CalendarView";
import { ScheduleListView } from "../components/Schedule/ListView";
import { Schedule } from "../types/schedule";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');

  useEffect(() => {
    // 더미 데이터 로드
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSchedules([
        // 8월 11일 (일요일)
        {
          id: "1",
          date: "2025-08-11",
          time: "09:00 - 11:00",
          clientName: "김영희",
          caregiverName: "박요양사",
          address: "서울시 강남구 역삼동",
          serviceType: "방문요양",
          status: "completed",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "2",
          date: "2025-08-11",
          time: "14:00 - 16:00",
          clientName: "박철수",
          caregiverName: "이요양사",
          address: "서울시 서초구 서초동",
          serviceType: "방문요양",
          status: "completed",
          duration: 2,
          hourlyRate: 16000
        },
        
        // 8월 12일 (월요일)
        {
          id: "3",
          date: "2025-08-12",
          time: "08:00 - 10:00",
          clientName: "이순자",
          caregiverName: "최요양사",
          address: "서울시 마포구 합정동",
          serviceType: "방문요양",
          status: "completed",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "4",
          date: "2025-08-12",
          time: "13:00 - 15:00",
          clientName: "최민수",
          caregiverName: "김요양사",
          address: "서울시 송파구 문정동",
          serviceType: "방문요양",
          status: "completed",
          duration: 2,
          hourlyRate: 17000
        },
        
        // 8월 13일 (화요일) - 오늘
        {
          id: "5",
          date: "2025-08-13",
          time: "09:00 - 11:00",
          clientName: "정미영",
          caregiverName: "박요양사",
          address: "서울시 강서구 화곡동",
          serviceType: "방문요양",
          status: "completed",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "6",
          date: "2025-08-13",
          time: "14:00 - 16:00",
          clientName: "김철수",
          caregiverName: "이요양사",
          address: "서울시 영등포구 여의도동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 18000
        },
        {
          id: "7",
          date: "2025-08-13",
          time: "18:00 - 20:00",
          clientName: "박영희",
          caregiverName: "최요양사",
          address: "서울시 성동구 성수동",
          serviceType: "방문요양",
          status: "pending_approval",
          duration: 2,
          hourlyRate: 16000
        },
        
        // 8월 14일 (수요일)
        {
          id: "8",
          date: "2025-08-14",
          time: "10:00 - 12:00",
          clientName: "이미라",
          caregiverName: "김요양사",
          address: "서울시 광진구 구의동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000,
          isRegular: true,
          regularSequence: { current: 3, total: 12 }
        },
        {
          id: "9",
          date: "2025-08-14",
          time: "15:00 - 17:00",
          clientName: "최동욱",
          caregiverName: "박요양사",
          address: "서울시 동대문구 신설동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 17000
        },
        
        // 8월 15일 (목요일)
        {
          id: "10",
          date: "2025-08-15",
          time: "08:00 - 10:00",
          clientName: "한지영",
          caregiverName: "이요양사",
          address: "서울시 중구 명동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000,
          isRegular: true,
          regularSequence: { current: 5, total: 8 }
        },
        {
          id: "11",
          date: "2025-08-15",
          time: "13:00 - 15:00",
          clientName: "송민호",
          caregiverName: "최요양사",
          address: "서울시 용산구 이태원동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        
        // 8월 16일 (금요일)
        {
          id: "12",
          date: "2025-08-16",
          time: "11:00 - 13:00",
          clientName: "윤서연",
          caregiverName: "김요양사",
          address: "서울시 서대문구 신촌동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "13",
          date: "2025-08-16",
          time: "16:00 - 18:00",
          clientName: "임태현",
          caregiverName: "박요양사",
          address: "서울시 종로구 종로",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 17000
        },
        
        // 8월 17일 (토요일)
        {
          id: "14",
          date: "2025-08-17",
          time: "09:00 - 11:00",
          clientName: "강미영",
          caregiverName: "이요양사",
          address: "서울시 노원구 공릉동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "15",
          date: "2025-08-18",
          time: "10:00 - 12:00",
          clientName: "박지민",
          caregiverName: "최요양사",
          address: "서울시 강북구 번동",
          serviceType: "방문요양",
          status: "cancelled",
          duration: 2,
          hourlyRate: 16000
        }
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const navigateWeek = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentWeek(new Date());
    } else {
      const newWeek = new Date(currentWeek);
      newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeek(newWeek);
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
      height: '80vh', 
      overflow: 'hidden',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingBottom: '16px'
    }}>
      <Flex direction="column" style={{ height: '100%' }}>
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
              schedules={schedules}
              onNavigateWeek={navigateWeek}
            />
            <ScheduleGridBody 
              schedules={schedules} 
              currentWeek={currentWeek} 
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
