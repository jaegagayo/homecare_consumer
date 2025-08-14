import { WorkSchedule } from '../data/schedules';

// 날짜별 스케줄을 그룹화하는 유틸리티 함수
export const groupSchedulesByDate = (schedules: WorkSchedule[]) => {
  const grouped: { [date: string]: WorkSchedule[] } = {};
  
  schedules.forEach(schedule => {
    if (!grouped[schedule.date]) {
      grouped[schedule.date] = [];
    }
    grouped[schedule.date].push(schedule);
  });
  
  return grouped;
};

// 근무 시간을 계산하는 유틸리티 함수
export const calculateWorkHours = (startTime: string, endTime: string): number => {
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

// 일별 급여를 계산하는 유틸리티 함수
export const calculateDailyWage = (schedule: WorkSchedule): number => {
  const hours = calculateWorkHours(schedule.startTime, schedule.endTime);
  return hours * schedule.hourlyWage;
}; 