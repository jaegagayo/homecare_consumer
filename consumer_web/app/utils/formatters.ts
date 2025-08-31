/**
 * 천 단위 구분 기호를 포함한 숫자 포맷팅
 * @param value - 포맷팅할 숫자 또는 문자열
 * @returns 천 단위 구분 기호가 포함된 문자열
 */
export const formatNumber = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseInt(value) : value;
  
  if (isNaN(numValue)) {
    return '0';
  }
  
  return numValue.toLocaleString('ko-KR');
};

/**
 * 통화 포맷팅 (원 단위)
 * @param value - 포맷팅할 숫자 또는 문자열
 * @returns "원" 단위가 포함된 포맷팅된 문자열
 */
export const formatCurrency = (value: number | string): string => {
  return `${formatNumber(value)}원`;
};

/**
 * 천 단위 구분 기호가 포함된 문자열을 숫자로 변환
 * @param value - 천 단위 구분 기호가 포함된 문자열
 * @returns 숫자
 */
export const parseFormattedNumber = (value: string): number => {
  const cleanValue = value.replace(/[^\d]/g, '');
  return parseInt(cleanValue) || 0;
};

/**
 * 오늘 날짜를 한국어 형식으로 포맷팅
 * @returns "2025년 8월 21일 (목)" 형식의 문자열
 */
export const formatToday = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[today.getDay()];
  
  return `${year}년 ${month}월 ${date}일 (${dayName})`;
};

/**
 * 시간 문자열을 AM/PM 형식으로 포맷팅
 * @param timeString - "09:00 - 11:00" 형식의 시간 문자열
 * @returns { start: "오전 09:00", end: "오전 11:00" } 형식의 객체
 */
export const formatTime = (timeString: string): { start: string; end: string } => {
  const [startTime, endTime] = timeString.split(' - ');
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startPeriod = startHours >= 12 ? '오후' : '오전';
  const endPeriod = endHours >= 12 ? '오후' : '오전';
  
  const startDisplayHours = startHours === 0 ? 12 : startHours > 12 ? startHours - 12 : startHours;
  const endDisplayHours = endHours === 0 ? 12 : endHours > 12 ? endHours - 12 : endHours;
  
  const startFormatted = `${startPeriod} ${startDisplayHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
  const endFormatted = `${endPeriod} ${endDisplayHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  
  return { start: startFormatted, end: endFormatted };
};

/**
 * 시간 문자열의 소요 시간을 계산
 * @param timeString - "09:00 - 11:00" 형식의 시간 문자열
 * @returns "2시간" 또는 "30분" 형식의 문자열
 */
export const calculateDuration = (timeString: string): string => {
  const [startTime, endTime] = timeString.split(' - ');
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // 자정을 넘어가는 경우
  }
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours > 0 && minutes > 0) {
    return `${hours}시간 ${minutes}분`;
  } else if (hours > 0) {
    return `${hours}시간`;
  } else {
    return `${minutes}분`;
  }
};

/**
 * 분 단위 시간을 한국어 형식으로 포맷팅
 * @param minutes - 분 단위 시간
 * @returns "2시간 30분" 또는 "45분" 형식의 문자열
 */
export const formatDuration = (minutes: number): string => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}시간${remainingMinutes > 0 ? ` ${remainingMinutes}분` : ''}`;
  }
  return `${minutes}분`;
}; 