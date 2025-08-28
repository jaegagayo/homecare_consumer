
import { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate } from '@remix-run/react';
import { Schedule } from '../../../types/schedule';

interface ScheduleGridBodyProps {
  schedules: Schedule[];
  currentWeek: Date;
  currentDayIndex: number; // 현재 표시할 3일의 시작 인덱스 (0-4)
  onDayIndexChange?: (newIndex: number) => void; // 헤더 동기화를 위한 콜백
}

export const HOUR_HEIGHT = 60; // px, 1시간당 높이
export const GRID_TOP_OFFSET = 28; // px, 헤더(요일) 높이
const TIME_LABEL_WIDTH = 60; // px, 시간 라벨 너비
const MIN_DAY_COLUMN_WIDTH = 100; // px, 최소 날짜 컬럼 너비

const ScheduleGridBody = forwardRef<HTMLDivElement, ScheduleGridBodyProps>(({ schedules, currentWeek, currentDayIndex, onDayIndexChange }, ref) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dayColumnWidthRef = useRef<number>(0);
  const isProgrammaticScroll = useRef(false);



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

  // 컴포넌트 마운트 시 초기 스크롤 설정
  useEffect(() => {
    if (scrollContainerRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentMinutes = currentHour * 60 + currentMinute;
      const targetScrollTop = (currentMinutes / 60) * HOUR_HEIGHT - 16;

      // 가로 스크롤이 완료된 후 세로 스크롤 적용
      setTimeout(() => {
        if (scrollContainerRef.current && !isProgrammaticScroll.current) {
          scrollContainerRef.current.scrollTop = Math.max(0, targetScrollTop);
          console.log('Initial scroll applied on mount:', {
            targetScrollTop,
            actualScrollTop: scrollContainerRef.current.scrollTop
          });
        }
      }, 300); // 가로 스크롤 완료를 기다리기 위해 300ms로 증가
    }
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트
    return () => clearInterval(timer);
  }, []);

  // 오늘의 예정된 일정 중 현재 시간에 가장 가까운 일정으로 스크롤 위치 설정
  useEffect(() => {
    // 스크롤 컨테이너가 준비되었는지 확인
    if (!scrollContainerRef.current) {
      return;
    }

    // 프로그래밍 스크롤 중에는 세로 스크롤 실행하지 않음
    if (isProgrammaticScroll.current) {
      return;
    }

    // 스크롤 위치 계산 함수
    const calculateAndApplyScroll = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식

      let targetScrollTop = 0;

      if (schedules.length > 0) {
        // 오늘의 예정된 일정들 필터링
        const todaySchedules = schedules.filter(schedule => {
          const scheduleDate = schedule.date;
          const scheduleTime = schedule.time.split(' - ')[0]; // 시작 시간만 추출
          const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

          return scheduleDate === today &&
            scheduleDateTime > now &&
            schedule.status === 'upcoming';
        });

        if (todaySchedules.length > 0) {
          // 현재 시간에 가장 가까운 일정 찾기
          const closestSchedule = todaySchedules.reduce((closest, current) => {
            const currentTime = new Date(`${current.date}T${current.time.split(' - ')[0]}`);
            const closestTime = new Date(`${closest.date}T${closest.time.split(' - ')[0]}`);

            const currentDiff = Math.abs(currentTime.getTime() - now.getTime());
            const closestDiff = Math.abs(closestTime.getTime() - now.getTime());

            return currentDiff < closestDiff ? current : closest;
          });

          // 가장 가까운 일정의 시간으로 스크롤 위치 계산
          const scheduleTime = closestSchedule.time.split(' - ')[0];
          const [scheduleHour, scheduleMinute] = scheduleTime.split(':').map(Number);
          const scheduleMinutes = scheduleHour * 60 + scheduleMinute;
          targetScrollTop = (scheduleMinutes / 60) * HOUR_HEIGHT - 16;

          console.log('Scrolling to closest schedule:', {
            schedule: closestSchedule,
            time: scheduleTime,
            targetScrollTop
          });
        } else {
          // 오늘 예정된 일정이 없으면 현재 시간으로 스크롤
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          const currentMinutes = currentHour * 60 + currentMinute;
          targetScrollTop = (currentMinutes / 60) * HOUR_HEIGHT - 16;

          console.log('No upcoming schedules today, scrolling to current time:', {
            currentTime: `${currentHour}:${currentMinute}`,
            targetScrollTop
          });
        }
      } else {
        // 스케줄 데이터가 없어도 현재 시간으로 스크롤
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentMinutes = currentHour * 60 + currentMinute;
        targetScrollTop = (currentMinutes / 60) * HOUR_HEIGHT - 16;

        console.log('No schedules data, scrolling to current time:', {
          currentTime: `${currentHour}:${currentMinute}`,
          targetScrollTop
        });
      }

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = Math.max(0, targetScrollTop);
        console.log('Scroll applied:', {
          scrollTop: scrollContainerRef.current.scrollTop,
          targetScrollTop,
          containerHeight: scrollContainerRef.current.clientHeight,
          scrollHeight: scrollContainerRef.current.scrollHeight
        });

        // 스크롤이 실제로 적용되었는지 확인
        setTimeout(() => {
          if (scrollContainerRef.current) {
            console.log('Scroll verification:', {
              actualScrollTop: scrollContainerRef.current.scrollTop,
              expectedScrollTop: targetScrollTop,
              isCorrect: Math.abs(scrollContainerRef.current.scrollTop - targetScrollTop) < 5
            });
          }
        }, 100);
      }
    };

    // 즉시 실행
    calculateAndApplyScroll();

    // 추가로 약간의 지연 후 다시 실행 (DOM이 완전히 렌더링된 후)
    const timeoutId = setTimeout(calculateAndApplyScroll, 100);

    return () => clearTimeout(timeoutId);
  }, [schedules]);



  // 스크롤 이벤트 핸들러 - 헤더 동기화
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // 프로그래밍 스크롤 중에는 무시
    if (isProgrammaticScroll.current) {
      return;
    }

    const scrollLeft = e.currentTarget.scrollLeft;
    const newDayIndex = Math.round(scrollLeft / dayColumnWidthRef.current);

    // 유효한 범위 내에서만 업데이트
    if (newDayIndex >= 0 && newDayIndex <= 4 && newDayIndex !== currentDayIndex) {
      onDayIndexChange?.(newDayIndex);
    }
  };

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
  const timeSlots = Array.from({ length: 24 }, (_, i) => ({
    label: `${i.toString().padStart(2, '0')}:00`,
    time: i
  }));

  const weekDates = getWeekDates(currentWeek);

  // 반응형 컬럼 너비 계산
  const calculateColumnWidth = () => {
    if (typeof window !== 'undefined') {
      const containerWidth = window.innerWidth - 32; // 좌우 패딩 고려
      const availableWidth = containerWidth - TIME_LABEL_WIDTH;
      const columnWidth = Math.max(MIN_DAY_COLUMN_WIDTH, availableWidth / 3); // 3일 표시
      return columnWidth;
    }
    return MIN_DAY_COLUMN_WIDTH;
  };

  const dayColumnWidth = calculateColumnWidth();
  dayColumnWidthRef.current = dayColumnWidth;

  // currentDayIndex가 변경될 때 스크롤 위치 조정
  useEffect(() => {
    if (scrollContainerRef.current) {
      // 프로그래밍 스크롤 플래그 설정
      isProgrammaticScroll.current = true;

      const targetScrollLeft = currentDayIndex * dayColumnWidthRef.current;

      // 스크롤 애니메이션 완료를 기다린 후 플래그 리셋 및 세로 스크롤 실행
      const checkScrollComplete = () => {
        if (scrollContainerRef.current) {
          const currentScrollLeft = scrollContainerRef.current.scrollLeft;
          const isComplete = Math.abs(currentScrollLeft - targetScrollLeft) < 5; // 5px 오차 허용

          if (isComplete) {
            isProgrammaticScroll.current = false;

            // 가로 스크롤 완료 후 세로 스크롤 실행
            setTimeout(() => {
              const now = new Date();
              const today = now.toISOString().split('T')[0];

              let targetScrollTop = 0;

              if (schedules.length > 0) {
                // 오늘의 예정된 일정들 필터링
                const todaySchedules = schedules.filter(schedule => {
                  const scheduleDate = schedule.date;
                  const scheduleTime = schedule.time.split(' - ')[0];
                  const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

                  return scheduleDate === today &&
                    scheduleDateTime > now &&
                    schedule.status === 'upcoming';
                });

                if (todaySchedules.length > 0) {
                  // 현재 시간에 가장 가까운 일정 찾기
                  const closestSchedule = todaySchedules.reduce((closest, current) => {
                    const currentTime = new Date(`${current.date}T${current.time.split(' - ')[0]}`);
                    const closestTime = new Date(`${closest.date}T${closest.time.split(' - ')[0]}`);

                    const currentDiff = Math.abs(currentTime.getTime() - now.getTime());
                    const closestDiff = Math.abs(closestTime.getTime() - now.getTime());

                    return currentDiff < closestDiff ? current : closest;
                  });

                  // 가장 가까운 일정의 시간으로 스크롤 위치 계산
                  const scheduleTime = closestSchedule.time.split(' - ')[0];
                  const [scheduleHour, scheduleMinute] = scheduleTime.split(':').map(Number);
                  const scheduleMinutes = scheduleHour * 60 + scheduleMinute;
                  targetScrollTop = (scheduleMinutes / 60) * HOUR_HEIGHT - 16;

                  console.log('Vertical scroll after horizontal scroll to closest schedule:', {
                    schedule: closestSchedule,
                    time: scheduleTime,
                    targetScrollTop
                  });
                } else {
                  // 오늘 예정된 일정이 없으면 현재 시간으로 스크롤
                  const currentHour = now.getHours();
                  const currentMinute = now.getMinutes();
                  const currentMinutes = currentHour * 60 + currentMinute;
                  targetScrollTop = (currentMinutes / 60) * HOUR_HEIGHT - 16;

                  console.log('Vertical scroll after horizontal scroll to current time:', {
                    currentTime: `${currentHour}:${currentMinute}`,
                    targetScrollTop
                  });
                }
              } else {
                // 스케줄 데이터가 없어도 현재 시간으로 스크롤
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                const currentMinutes = currentHour * 60 + currentMinute;
                targetScrollTop = (currentMinutes / 60) * HOUR_HEIGHT - 16;

                console.log('Vertical scroll after horizontal scroll (no data):', {
                  currentTime: `${currentHour}:${currentMinute}`,
                  targetScrollTop
                });
              }

              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = Math.max(0, targetScrollTop);
                console.log('Vertical scroll applied after horizontal scroll:', {
                  scrollTop: scrollContainerRef.current.scrollTop,
                  targetScrollTop
                });
              }
            }, 100); // 가로 스크롤 완료 후 100ms 지연
          } else {
            requestAnimationFrame(checkScrollComplete);
          }
        }
      };

      scrollContainerRef.current.scrollLeft = targetScrollLeft;
      requestAnimationFrame(checkScrollComplete);
    }
  }, [currentDayIndex, schedules]);

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
      position: 'relative',
      background: 'transparent',
      minHeight: 0,
      height: 'calc(100vh - 300px)' // 스크롤 영역 확장 (요양보호사 앱과 동일)
    }} ref={gridRef}>

      {/* 전체 스크롤 컨테이너 */}
      <div
        ref={scrollContainerRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          scrollBehavior: 'smooth'
        }}
        onScroll={handleScroll}
      >
        {/* 전체 그리드 컨테이너 */}
        <div style={{
          width: TIME_LABEL_WIDTH + (weekDates.length * dayColumnWidth),
          minHeight: HOUR_HEIGHT * 26 + GRID_TOP_OFFSET, // 26시간으로 설정하여 확실히 스크롤 가능하게
          position: 'relative'
        }}>

          {/* 요일 헤더 */}
          <div style={{
            display: 'flex',
            height: GRID_TOP_OFFSET,
            position: 'sticky',
            top: 0,
            zIndex: 30,
            background: 'white',
            border: '1px solid var(--gray-6)',
            borderBottom: '1px solid var(--gray-6)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {/* 시간 라벨 헤더 공간 */}
            <div style={{
              width: TIME_LABEL_WIDTH,
              flexShrink: 0,
              background: 'white',
              borderRight: '1px solid var(--gray-6)'
            }} />

            {/* 날짜 헤더 */}
            {weekDates.map((date, idx) => (
              <div key={idx} style={{
                width: dayColumnWidth,
                flexShrink: 0,
                background: isToday(date) ? 'var(--accent-9)' : 'transparent',
                color: isToday(date) ? 'var(--accent-3)' : 'var(--gray-11)',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                borderRight: idx < 6 ? '1px solid var(--gray-6)' : undefined
              }}>{formatDate(date)}</div>
            ))}
          </div>

          {/* 그리드 본문 */}
          <div style={{ display: 'flex', position: 'relative' }}>
            {/* 시간 라벨 - 고정 */}
            <div style={{
              width: TIME_LABEL_WIDTH,
              flexShrink: 0,
              position: 'sticky',
              left: 0,
              zIndex: 20,
              background: 'white',
              borderRight: '1px solid var(--gray-6)'
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
                  background: 'white'
                }}>{slot.label}</div>
              ))}
            </div>

            {/* 날짜 컬럼들 */}
            {weekDates.map((date, dateIdx) => (
              <div key={dateIdx} style={{
                width: dayColumnWidth,
                flexShrink: 0,
                position: 'relative',
                height: HOUR_HEIGHT * 24, // 이미 24시간으로 설정됨
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
                    <button
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: 4,
                        right: 4,
                        top,
                        height,
                        background: `var(--${statusColor}-3)`,
                        border: `1px solid var(--${statusColor}-11)`,
                        borderRadius: 4,
                        color: `var(--${statusColor}-11)`,
                        fontSize: 10,
                        padding: '4px 6px',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.08)',
                        outline: 'none'
                      }}
                      onClick={() => navigate(`/main/schedule-detail?id=${schedule.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/main/schedule-detail?id=${schedule.id}`);
                        }
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 11, lineHeight: 1.1 }}>
                        {schedule.serviceType}
                      </div>
                      <div style={{ fontSize: 10, lineHeight: 1.1, marginTop: 1 }}>
                        {schedule.clientName}
                      </div>
                    </button>
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
    </div>
  );
});

ScheduleGridBody.displayName = 'ScheduleGridBody';

export default ScheduleGridBody;
