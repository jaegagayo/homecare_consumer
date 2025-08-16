import { useState, useEffect } from "react";
import { 
  Container, 
  Flex, 
  Text
} from "@radix-ui/themes";
import { ScheduleGrid } from "../components/Schedule";

interface Schedule {
  id: string;
  date: string;
  time: string;
  clientName: string;
  address: string;
  serviceType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number; // 시간 단위
  hourlyRate: number;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [isLoading, setIsLoading] = useState(true);

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
          address: "서울시 성동구 성수동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000
        },
        
        // 8월 14일 (수요일)
        {
          id: "8",
          date: "2025-08-14",
          time: "10:00 - 12:00",
          clientName: "이미라",
          address: "서울시 광진구 구의동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        },
        {
          id: "9",
          date: "2025-08-14",
          time: "15:00 - 17:00",
          clientName: "최동욱",
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
          address: "서울시 중구 명동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 16000
        },
        {
          id: "11",
          date: "2025-08-15",
          time: "13:00 - 15:00",
          clientName: "송민호",
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
          address: "서울시 노원구 공릉동",
          serviceType: "방문요양",
          status: "upcoming",
          duration: 2,
          hourlyRate: 15000
        }
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <Container size="2" className="p-4">
        <Text>로딩 중...</Text>
      </Container>
    );
  }

  return (
    <Container size="2" className="p-4" style={{ height: '80vh', overflow: 'hidden' }}>
      <Flex direction="column" style={{ height: '100%' }}>

        {/* 캘린더 뷰 */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', maxHeight: '80vh' }}>
          <ScheduleGrid schedules={schedules} />
        </div>
      </Flex>
    </Container>
  );
}
