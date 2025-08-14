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