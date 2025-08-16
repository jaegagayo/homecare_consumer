
import { useState, useEffect, useRef, forwardRef } from 'react';
import { ClockIcon, HomeIcon, PersonIcon } from '@radix-ui/react-icons';
import { Popover, Text, Flex, Badge } from '@radix-ui/themes';

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

interface ScheduleGridBodyProps {
  schedules: Schedule[];
  currentWeek: Date;
}

const HOUR_HEIGHT = 60; // px, 1시간당 높이
const GRID_TOP_OFFSET = 28; // px, 헤더(요일) 높이

const ScheduleGridBody = forwardRef<HTMLDivElement, ScheduleGridBodyProps>(({ schedules, currentWeek }, ref) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const gridRef = useRef<HTMLDivElement>(null);

  // ref를 gridRef와 연결
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(gridRef.current);
      } else {
        ref.current = gridRef.current;
      }
    }
  }, [ref]);

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트
    return () => clearInterval(timer);
  }, []);

  // 현재 시간을 기준으로 스크롤 위치 설정
  useEffect(() => {
    if (gridRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentMinutes = currentHour * 60 + currentMinute;
      const scrollTop = (currentMinutes / 60) * HOUR_HEIGHT - 16;
      
      gridRef.current.scrollTop = Math.max(0, scrollTop);
    }
  }, []);

  // 주간 날짜 배열 생성
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay()); // 일요일부터 시작
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // 시간대 배열 (0-24시, 요양보호사 업무 시간)
  const timeSlots = Array.from({ length: 25 }, (_, i) => ({
    label: `${i.toString().padStart(2, '0')}:00`,
    time: i
  }));

  const weekDates = getWeekDates(currentWeek);
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (timeString: string) => {
    // "09:00 - 11:00" 형태에서 시작 시간만 추출
    return timeString.split(' - ')[0];
  };

  // 스케줄 블록 위치 계산 (그리드 기준)
  const calculateSchedulePosition = (timeString: string, duration: number) => {
    const startTime = formatTime(timeString);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = Math.max((duration / 60) * HOUR_HEIGHT, 18);
    return { top, height };
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${day}(${weekday})`; // 모바일용으로 축약
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div style={{ 
      flex: 1, 
      overflow: 'auto', 
      position: 'relative', 
      background: 'transparent',
      minHeight: 0,
      maxHeight: HOUR_HEIGHT * 32 + GRID_TOP_OFFSET // 더 많은 시간대를 보이도록 확장
    }} ref={gridRef}>
      {/* 요일 헤더 - 고정 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '60px repeat(7, 1fr)', 
        height: GRID_TOP_OFFSET,
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'white',
        border: '1px solid var(--gray-6)',
        borderBottom: '1px solid var(--gray-6)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ background: 'white' }} />
        {weekDates.map((date, idx) => (
          <div key={idx} style={{
            background: isToday(date) ? 'var(--accent-9)' : 'transparent',
            color: isToday(date) ? 'var(--accent-3)' : 'var(--gray-11)',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>{formatDate(date)}</div>
        ))}
      </div>
      
              {/* 시간 라벨 + 그리드 선 - 스크롤 가능 */}
        <div style={{ display: 'flex', position: 'relative', minHeight: HOUR_HEIGHT * 25 }}>
        {/* 시간 라벨 - 고정 */}
        <div style={{ 
          width: 60, 
          flexShrink: 0, 
          position: 'sticky', 
          left: 0,
          zIndex: 20,
          background: 'transparent'
        }}>
          {timeSlots.map((slot, i) => (
            <div key={i} style={{
              height: HOUR_HEIGHT,
              borderTop: '1px solid var(--gray-6)',
              fontSize: 10,
              color: '#888',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              paddingRight: 4,
              paddingTop: 2,
              background: 'transparent'
            }}>{slot.label}</div>
          ))}
        </div>
        
                  {/* 그리드 선만 있는 영역 - 스크롤 가능 */}
          <div style={{ 
            flex: 1, 
            position: 'relative', 
            display: 'grid', 
            gridTemplateColumns: `repeat(7, 1fr)`,
            minHeight: HOUR_HEIGHT * 25
          }}>
            {weekDates.map((date, dateIdx) => (
              <div key={dateIdx} style={{ 
                position: 'relative', 
                height: HOUR_HEIGHT * 24, 
                borderRight: dateIdx < 6 ? '1px solid var(--gray-6)' : undefined 
              }}>
              {/* 수평선 */}
              {timeSlots.map((slot, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: i * HOUR_HEIGHT,
                  left: 0,
                  right: 0,
                  height: 0,
                  borderTop: '1px solid var(--gray-6)',
                  zIndex: 1
                }} />
              ))}
              
              {/* 스케줄 블록 오버레이 */}
              {getSchedulesForDate(date).map((schedule, idx) => {
                const { top, height } = calculateSchedulePosition(schedule.time, schedule.duration * 60);
                const statusColor = getStatusColor(schedule.status);
                return (
                  <Popover.Root key={idx}>
                    <Popover.Trigger>
                      <div style={{
                        position: 'absolute',
                        left: 2,
                        right: 2,
                        top,
                        height,
                        background: `var(--${statusColor}-3)`,
                        border: `1px solid var(--${statusColor}-11)`,
                        borderRadius: 4,
                        color: `var(--${statusColor}-11)`,
                        fontSize: 10,
                        padding: '2px 4px',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.08)'
                      }}>
                        <div style={{ fontWeight: 600, fontSize: 11, lineHeight: 1.1 }}>
                          {schedule.serviceType}
                        </div>
                        <div style={{ fontSize: 10, lineHeight: 1.1, marginTop: 1 }}>
                          {schedule.clientName}
                        </div>
                      </div>
                    </Popover.Trigger>
                    <Popover.Content style={{ width: 280, maxWidth: '90vw' }}>
                      <Flex direction="column" gap="3">
                        <Flex justify="between" align="center">
                          <Text size="3" weight="bold">{schedule.serviceType}</Text>
                          <Badge 
                            color={statusColor === 'blue' ? 'blue' : statusColor === 'green' ? 'green' : 'red'}
                            variant="soft"
                          >
                            {schedule.status === 'upcoming' ? '예정' : schedule.status === 'completed' ? '완료' : '취소'}
                          </Badge>
                        </Flex>
                        
                        <Flex direction="column" gap="2">
                          <Flex align="center" gap="2">
                            <PersonIcon width="14" height="14" />
                            <Text size="2">{schedule.clientName}</Text>
                          </Flex>
                          
                          <Flex align="center" gap="2">
                            <HomeIcon width="14" height="14" />
                            <Text size="2">{schedule.address}</Text>
                          </Flex>
                          
                          <Flex align="center" gap="2">
                            <ClockIcon width="14" height="14" />
                            <Text size="2">{schedule.time}</Text>
                          </Flex>
                          
                          <Flex justify="between" align="center">
                            <Text size="2" color="gray">시급</Text>
                            <Text size="2" weight="bold">₩{schedule.hourlyRate.toLocaleString()}</Text>
                          </Flex>
                          
                          <Flex justify="between" align="center">
                            <Text size="2" color="gray">총 금액</Text>
                            <Text size="2" weight="bold">₩{(schedule.hourlyRate * schedule.duration).toLocaleString()}</Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Popover.Content>
                  </Popover.Root>
                );
              })}
              
              {/* 현재 시간 라인 */}
              {isToday(date) && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: ((currentTime.getHours() * 60 + currentTime.getMinutes()) / 60) * HOUR_HEIGHT,
                  height: 2,
                  background: '#ef4444',
                  zIndex: 20
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ScheduleGridBody.displayName = 'ScheduleGridBody';

export default ScheduleGridBody;
