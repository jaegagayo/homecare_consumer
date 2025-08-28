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
    // 더미 데이터 로드
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSchedules([
        // 8월 29일 (금요일) - 오늘
        {
          id: "1",
          date: "2025-08-29",
          time: "09:00 - 11:00",
          clientName: "김영희",
          address: "서울시 강남구 역삼동 123-45",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "2",
          date: "2025-08-29",
          time: "14:00 - 16:00",
          clientName: "박철수",
          address: "서울시 서초구 서초동 456-78",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000
        },
        {
          id: "3",
          date: "2025-08-29",
          time: "18:00 - 20:00",
          clientName: "이순자",
          address: "서울시 마포구 합정동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        
        // 8월 30일 (토요일)
        {
          id: "4",
          date: "2025-08-30",
          time: "10:00 - 12:00",
          clientName: "최민수",
          address: "서울시 송파구 문정동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 17000
        },
        {
          id: "5",
          date: "2025-08-30",
          time: "15:00 - 17:00",
          clientName: "정미영",
          address: "서울시 강서구 화곡동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        
        // 8월 31일 (일요일)
        {
          id: "6",
          date: "2025-08-31",
          time: "11:00 - 13:00",
          clientName: "김철수",
          address: "서울시 영등포구 여의도동 789-12",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 18000
        },
        {
          id: "7",
          date: "2025-08-31",
          time: "16:00 - 18:00",
          clientName: "박영희",
          address: "서울시 성동구 성수동 345-67",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000
        },
        
        // 9월 1일 (월요일)
        {
          id: "8",
          date: "2025-09-01",
          time: "08:00 - 10:00",
          clientName: "이미라",
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
          date: "2025-09-01",
          time: "13:00 - 15:00",
          clientName: "최동욱",
          address: "서울시 동대문구 신설동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 17000
        },
        {
          id: "10",
          date: "2025-09-01",
          time: "18:00 - 20:00",
          clientName: "한지영",
          address: "서울시 중구 명동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000,
          isRegular: true,
          regularSequence: { current: 5, total: 8 }
        },
        
        // 9월 2일 (화요일)
        {
          id: "11",
          date: "2025-09-02",
          time: "09:00 - 11:00",
          clientName: "송민호",
          address: "서울시 용산구 이태원동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "12",
          date: "2025-09-02",
          time: "14:00 - 16:00",
          clientName: "윤서연",
          address: "서울시 서대문구 신촌동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        
        // 9월 3일 (수요일)
        {
          id: "13",
          date: "2025-09-03",
          time: "10:00 - 12:00",
          clientName: "임태현",
          address: "서울시 종로구 종로",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 17000
        },
        {
          id: "14",
          date: "2025-09-03",
          time: "15:00 - 17:00",
          clientName: "강미영",
          address: "서울시 노원구 공릉동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        
        // 9월 4일 (목요일)
        {
          id: "15",
          date: "2025-09-04",
          time: "11:00 - 13:00",
          clientName: "김수진",
          address: "서울시 강남구 청담동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 18000
        },
        {
          id: "16",
          date: "2025-09-04",
          time: "16:00 - 18:00",
          clientName: "이현우",
          address: "서울시 마포구 상암동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000
        },
        
        // 9월 5일 (금요일)
        {
          id: "17",
          date: "2025-09-05",
          time: "09:00 - 11:00",
          clientName: "박지민",
          address: "서울시 강북구 번동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000
        },
        {
          id: "18",
          date: "2025-09-05",
          time: "14:00 - 16:00",
          clientName: "정민수",
          
          address: "서울시 송파구 잠실동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 17000
        },
        
        // 8월 19일 (월요일)
        {
          id: "19",
          date: "2025-08-19",
          time: "08:00 - 10:00",
          clientName: "최영희",
          
          address: "서울시 서초구 반포동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000,
          isRegular: true,
          regularSequence: { current: 7, total: 10 }
        },
        {
          id: "20",
          date: "2025-08-19",
          time: "13:00 - 15:00",
          clientName: "김도현",
          
          address: "서울시 영등포구 당산동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000
        },
        {
          id: "21",
          date: "2025-08-19",
          time: "17:00 - 19:00",
          clientName: "박서연",
          
          address: "서울시 강서구 화곡동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        
        // 8월 20일 (화요일)
        {
          id: "22",
          date: "2025-08-20",
          time: "09:00 - 11:00",
          clientName: "이준호",
          
          address: "서울시 동대문구 답십리동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "23",
          date: "2025-08-20",
          time: "14:00 - 16:00",
          clientName: "정수진",
          
          address: "서울시 광진구 자양동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 17000,
          isRegular: true,
          regularSequence: { current: 6, total: 8 }
        },
        {
          id: "24",
          date: "2025-08-20",
          time: "19:00 - 21:00",
          clientName: "김민지",
          
          address: "서울시 성동구 왕십리동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000
        },
        
        // 8월 21일 (수요일)
        {
          id: "25",
          date: "2025-08-21",
          time: "08:00 - 10:00",
          clientName: "박현우",
          
          address: "서울시 중구 신당동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "26",
          date: "2025-08-21",
          time: "12:00 - 14:00",
          clientName: "이지은",
          
          address: "서울시 용산구 한남동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 18000
        },
        {
          id: "27",
          date: "2025-08-21",
          time: "16:00 - 18:00",
          clientName: "최동욱",
          
          address: "서울시 서대문구 연희동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000
        },
        
        // 8월 22일 (목요일)
        {
          id: "28",
          date: "2025-08-22",
          time: "10:00 - 12:00",
          clientName: "김서연",
          
          address: "서울시 종로구 평창동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "29",
          date: "2025-08-22",
          time: "15:00 - 17:00",
          clientName: "정민호",
          
          address: "서울시 마포구 합정동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 17000
        },
        {
          id: "30",
          date: "2025-08-22",
          time: "19:00 - 21:00",
          clientName: "박지훈",
          
          address: "서울시 강남구 논현동",
          serviceType: "방문요양",
          status: "upcoming",
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
