import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Container,
  Flex,
  Text,
  Button,
  TextArea,
  Heading,
  Select,
  Dialog
} from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  CreditCard,
  Info,
  X
} from "lucide-react";

interface ServiceType {
  value: string;
  label: string;
  description: string;
}



interface ApplicationForm {
  // 기본 정보
  serviceType: string;
  address: string;
  specialRequests: string;

  // 바우처 정보 (간소화)
  estimatedUsage: number;

  // 조건 정보
  duration: number; // 1회 소요시간
  requestedDates: string[]; // 요청 일자들 (YYYY-MM-DD 형식)
  preferredHours: {
    start: string;
    end: string;
  };
  preferredAreas: string[];
}

interface VoucherInfo {
  selectedGrade: string;
  voucherLimit: number;
  currentUsage: number;
  selfPayAmount: number;
  isMedicalBenefitRecipient: boolean;
}

const serviceTypes: ServiceType[] = [
  { value: 'visiting-care', label: '방문요양서비스', description: '가정을 방문하여 일상생활 지원' },
  { value: 'day-night-care', label: '주야간보호서비스', description: '주간 또는 야간 보호 서비스' },
  { value: 'respite-care', label: '단기보호서비스', description: '일시적인 보호 서비스' },
  { value: 'visiting-bath', label: '방문목욕서비스', description: '가정 방문 목욕 서비스' },
  { value: 'in-home-support', label: '재가노인지원서비스', description: '재가 노인을 위한 종합 지원' },
  { value: 'visiting-nursing', label: '방문간호서비스', description: '전문 간호 서비스' },
];

const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];



export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [isPreferredDaysDialogOpen, setIsPreferredDaysDialogOpen] = useState(false);
  const [isPreferredHoursDialogOpen, setIsPreferredHoursDialogOpen] = useState(false);
  const [isDurationDialogOpen, setIsDurationDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // 단계별 선택을 위한 상태
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [selectionStep, setSelectionStep] = useState<'start' | 'end' | 'weekday'>('start');
  const [weekdayFilter, setWeekdayFilter] = useState<boolean[]>([true, true, true, true, true, true, true]); // 일~토
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set()); // 개별 날짜 선택 상태
  
  // 시작일/종료일에 따라 현재 월 자동 설정
  useEffect(() => {
    if (selectionStep === 'start' && dateRange.start) {
      // 시작일이 설정되어 있으면 시작일이 있는 월로 이동
      const startDate = new Date(dateRange.start);
      setCurrentMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    } else if (selectionStep === 'end' && dateRange.end) {
      // 종료일이 설정되어 있으면 종료일이 있는 월로 이동
      const endDate = new Date(dateRange.end);
      setCurrentMonth(new Date(endDate.getFullYear(), endDate.getMonth(), 1));
    }
  }, [selectionStep, dateRange.start, dateRange.end]);

  const [form, setForm] = useState<ApplicationForm>({
    serviceType: '',
    address: '',
    specialRequests: '',
    estimatedUsage: 0,
    duration: 2, // 기본 2시간
    requestedDates: [], // 빈 배열로 시작
    preferredHours: { start: '09:00', end: '18:00' },
    preferredAreas: ['서울시 강남구']
  });

  // 바우처 정보 (실제로는 프로필에서 가져와야 함)
  const [voucherInfo] = useState<VoucherInfo>({
    selectedGrade: '3등급',
    voucherLimit: 1295400,
    currentUsage: 1200000, // 사용량을 높여서 남은 금액이 적게 설정
    selfPayAmount: 194310,
    isMedicalBenefitRecipient: false
  });

  useEffect(() => {
    // 예상 사용량 계산 (서비스 유형과 소요시간에 따라)
    let estimatedCost = 0;
    if (form.serviceType) {
      // 간단한 예상 비용 계산 (실제로는 더 복잡한 로직 필요)
      const baseHourlyRate = 15000; // 기본 시급
      estimatedCost = baseHourlyRate * form.duration;
    }

    setForm(prev => ({
      ...prev,
      estimatedUsage: estimatedCost
    }));
  }, [form.serviceType, form.duration]);

  const handleSubmit = async () => {
    if (!form.serviceType || !form.address) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    // 예상 사용량이 있는 경우 안내
    if (isOverLimit) {
      setIsVoucherDialogOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 실제 API 호출 - 신청서 저장
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 신청서 데이터를 매칭 페이지로 전달
      navigate('/main/matching', { 
        state: { 
          applicationData: form,
          fromApplication: true 
        } 
      });
    } catch (error) {
      alert('신청서 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoucherConfirm = () => {
    setIsVoucherDialogOpen(false);
    handleSubmit();
  };



  // 헬퍼 함수들
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 로컬 날짜 문자열 생성 (YYYY-MM-DD 형식)
  const toLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDatesBetween = (startStr: string, endStr: string) => {
    const res: string[] = [];
    const start = new Date(startStr);
    const end = new Date(endStr);
    const cur = new Date(start);
    while (cur <= end) {
      res.push(toLocalDateString(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return res;
  };

  const handleDateSelection = (dateString: string) => {
    if (selectionStep === 'start') {
      setDateRange({ start: dateString, end: null });
      setSelectionStep('end');
    } else if (selectionStep === 'end') {
      if (!dateRange.start) return;
      if (dateString < dateRange.start) {
        setDateRange({ start: dateString, end: dateRange.start });
      } else {
        setDateRange(prev => ({ ...prev, end: dateString }));
      }
      setSelectionStep('weekday');
      
      // 요일 필터 단계 진입 시 전체 범위를 선택된 상태로 설정
      const startDate = dateString < dateRange.start ? dateString : dateRange.start;
      const endDate = dateString < dateRange.start ? dateRange.start : dateString;
      const allDates = getDatesBetween(startDate, endDate);
      setSelectedDates(new Set(allDates));
    }
  };

  const handleStepClick = (step: 'start' | 'end' | 'weekday') => {
    if (step === 'start') {
      setSelectionStep('start');
    } else if (step === 'end' && dateRange.start) {
      setSelectionStep('end');
    } else if (step === 'weekday' && dateRange.start && dateRange.end) {
      setSelectionStep('weekday');
    }
  };

  const toggleWeekday = (index: number) => {
    setWeekdayFilter(prev => {
      const newFilter = [...prev];
      newFilter[index] = !newFilter[index];
      return newFilter;
    });
    
    // 요일 필터 토글 시 해당 요일의 모든 날짜를 selectedDates에서 토글
    if (dateRange.start && dateRange.end) {
      const allDates = getDatesBetween(dateRange.start, dateRange.end);
      const targetWeekdayDates = allDates.filter(date => {
        const dayOfWeek = new Date(date).getDay();
        return dayOfWeek === index;
      });
      
      setSelectedDates(prev => {
        const newSet = new Set(prev);
        const isCurrentlySelected = weekdayFilter[index];
        
        targetWeekdayDates.forEach(date => {
          if (isCurrentlySelected) {
            // 현재 선택된 상태라면 해당 요일의 날짜들을 모두 제거
            newSet.delete(date);
          } else {
            // 현재 선택되지 않은 상태라면 해당 요일의 날짜들을 모두 추가
            newSet.add(date);
          }
        });
        
        return newSet;
      });
    }
  };

  const toggleDate = (dateString: string) => {
    setSelectedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateString)) {
        newSet.delete(dateString);
      } else {
        newSet.add(dateString);
      }
      
      // 개별 날짜 토글 후 해당 요일의 모든 날짜가 선택되었는지 확인
      if (dateRange.start && dateRange.end) {
        const dayOfWeek = new Date(dateString).getDay();
        const allDates = getDatesBetween(dateRange.start, dateRange.end);
        const targetWeekdayDates = allDates.filter(date => {
          const dateDayOfWeek = new Date(date).getDay();
          return dateDayOfWeek === dayOfWeek;
        });
        
        // 해당 요일의 모든 날짜가 선택되었는지 확인
        const allWeekdaySelected = targetWeekdayDates.every(date => newSet.has(date));
        
        // 요일 필터 상태 동기화
        setWeekdayFilter(prev => {
          const newFilter = [...prev];
          newFilter[dayOfWeek] = allWeekdaySelected;
          return newFilter;
        });
      }
      
      return newSet;
    });
  };

  const confirmDateSelection = () => {
    if (!dateRange.start || !dateRange.end) {
      alert('시작일과 종료일을 선택해주세요.');
      return;
    }
    
    // 개별 선택된 날짜들을 사용
    const selectedDatesArray = Array.from(selectedDates);
    
    setForm(prev => ({ ...prev, requestedDates: selectedDatesArray }));
    setIsPreferredDaysDialogOpen(false);
    
    // 확인 시에만 상태 초기화
    setDateRange({ start: null, end: null });
    setSelectionStep('start');
    setWeekdayFilter([true, true, true, true, true, true, true]);
    setSelectedDates(new Set());
  };

  // 다이얼로그가 닫힐 때 상태 복원
  const handleDialogClose = () => {
    setIsPreferredDaysDialogOpen(false);
    // 상태는 그대로 유지 (초기화하지 않음)
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD 형식
    }
    return dates;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  // 바우처 정보 계산
  const totalUsage = voucherInfo.currentUsage + form.estimatedUsage;
  const remainingAmount = voucherInfo.voucherLimit - totalUsage;
  const isOverLimit = totalUsage > voucherInfo.voucherLimit;

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">



        {/* 서비스 신청서 */}
        <div className="space-y-6">
          <div>
            <Heading size="5" className="mb-2">원하시는 서비스 조건을 입력해주세요</Heading>
            <Text size="2" color="gray">
              조건에 맞는 요양보호사를 찾아드립니다.
            </Text>
          </div>

          {/* 서비스 유형 선택 */}
          <div className="space-y-3">
            <Heading size="3">서비스 유형 *</Heading>
            <Select.Root value={form.serviceType} onValueChange={(value) => setForm(prev => ({ ...prev, serviceType: value }))}>
              <Select.Trigger placeholder="서비스 유형을 선택하세요" className="w-full" />
              <Select.Content>
                {serviceTypes.filter(service => service.value === 'visiting-care').map((service) => (
                  <Select.Item key={service.value} value={service.value}>
                    {service.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            {/* 추후 서비스 안내 */}
            <Flex align="center" gap="2">
              <Info size={24} style={{ color: 'var(--accent-10)' }} />
              <Text size="1" style={{ color: 'var(--accent-10)' }}>
                주야간보호, 단기보호, 방문목욕, 재가노인지원, 방문간호 서비스는 준비 중입니다.
                빠른 시일 내에 서비스를 제공할 예정입니다.
              </Text>
            </Flex>
          </div>

          {/* 서비스 주소 */}
          <div className="space-y-3">
            <Heading size="3">서비스 주소 *</Heading>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
              placeholder="서비스를 받을 주소를 입력하세요"
              className="w-full h-8 px-3 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* 매칭 조건 */}
          <div className="space-y-4">
            <div>
              <Heading size="3">매칭 조건 *</Heading>
              <Text size="2" color="gray">해당 부분을 눌러서 변경할 수 있습니다.</Text>
            </div>

            {/* 요청 일자 */}
            <div className="space-y-2">
              <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsPreferredDaysDialogOpen(true)}>
                <Text size="2" weight="medium">요청 일자</Text>
                <Text size="2" color="gray">
                  {form.requestedDates.length > 0 ? (
                    <>
                      {(() => {
                        const sortedDates = [...form.requestedDates].sort();
                        const startDate = sortedDates[0];
                        const endDate = sortedDates[sortedDates.length - 1];
                        return `${startDate} ~ ${endDate} (${form.requestedDates.length}일)`;
                      })()}
                    </>
                  ) : (
                    '선택해주세요'
                  )}
                </Text>
              </Flex>
            </div>

            {/* 가능한 시간대 */}
            <div className="space-y-2">
              <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsPreferredHoursDialogOpen(true)}>
                <Text size="2" weight="medium">가능한 시간대</Text>
                <Text size="2" color="gray">{form.preferredHours.start} ~ {form.preferredHours.end}</Text>
              </Flex>
            </div>

            {/* 1회 소요시간 */}
            <div className="space-y-2">
              <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsDurationDialogOpen(true)}>
                <Text size="2" weight="medium">1회 소요시간</Text>
                <Text size="2" color="gray">{form.duration}시간</Text>
              </Flex>
            </div>
          </div>

          {/* 특별 요청사항 */}
          <div className="space-y-3">
            <Heading size="3">특별 요청사항</Heading>
            <TextArea
              value={form.specialRequests}
              onChange={(e) => setForm(prev => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="요양보호사에게 전달할 특별한 요청사항이 있다면 입력해주세요"
              className="w-full"
              rows={4}
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <Button
          size="3"
          onClick={handleSubmit}
          disabled={isLoading || !form.serviceType || !form.address}
          className="w-full"
        >
          {isLoading ? '저장 중...' : '후보 보기'}
        </Button>

        {/* 플로팅 카드 공간 확보 */}
        <div className="h-20"></div>
      </Flex>

      {/* 플로팅 바우처 정보 */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <Flex align="center" justify="between" className="mb-2">
              <Flex align="center" gap="2">
                <CreditCard size={16} className="text-blue-600" />
                <Text size="2" weight="medium">바우처 현황</Text>
              </Flex>
              {isOverLimit && (
                <div className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                  한도 초과
                </div>
              )}
            </Flex>
            <Flex direction="column" gap="1">
              <Flex justify="between">
                <Text size="1" color="gray">예상 사용 금액</Text>
                <Text size="1" weight="medium">{form.estimatedUsage.toLocaleString()}원</Text>
              </Flex>
              <Flex justify="between">
                <Text size="1" color="gray">남은 금액</Text>
                <Text
                  size="1"
                  weight="medium"
                  color={remainingAmount < 0 ? "red" : remainingAmount < 100000 ? "orange" : "green"}
                >
                  {remainingAmount.toLocaleString()}원
                </Text>
              </Flex>
            </Flex>
            {isOverLimit && (
              <Flex align="center" gap="1" className="mt-2 pt-2 border-t border-gray-100">
                <Info size={12} className="text-red-500" />
                <Text size="1" color="red">본인부담금 발생 가능</Text>
              </Flex>
            )}
          </div>
        </div>
      </div>

      {/* 1회 소요시간 설정 다이얼로그 */}
      <Dialog.Root open={isDurationDialogOpen} onOpenChange={setIsDurationDialogOpen}>
        <Dialog.Content>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Dialog.Title className="flex items-center">1회 소요시간 설정</Dialog.Title>
              <Button
                variant="ghost"
                size="2"
                onClick={() => setIsDurationDialogOpen(false)}
                className="flex items-center gap-1 self-center -mt-4"
              >
                <X size={16} />
                <Text size="2" weight="medium">닫기</Text>
              </Button>
            </Flex>
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium" className="mb-2">시간 선택</Text>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((hour) => (
                  <button
                    key={hour}
                    className={`py-3 px-6 rounded-full text-center cursor-pointer transition-colors ${form.duration === hour
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    style={{
                      backgroundColor: form.duration === hour
                        ? 'var(--accent-9)'
                        : 'var(--gray-3)'
                    }}
                    onClick={() => setForm(prev => ({ ...prev, duration: hour }))}
                  >
                    <Text size="2" weight="medium">{hour}시간</Text>
                  </button>
                ))}
              </div>
            </Flex>

            <Flex gap="3" className="mt-4">
              <Button
                onClick={() => setIsDurationDialogOpen(false)}
                className="flex-1"
              >
                확인
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* 요청 일자 설정 다이얼로그 */}
      <Dialog.Root open={isPreferredDaysDialogOpen} onOpenChange={setIsPreferredDaysDialogOpen}>
        <Dialog.Content>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Dialog.Title className="flex items-center">요청 일자 설정</Dialog.Title>
              <Button
                variant="ghost"
                size="2"
                onClick={handleDialogClose}
                className="flex items-center gap-1 self-center -mt-4"
              >
                <X size={16} />
                <Text size="2" weight="medium">닫기</Text>
              </Button>
            </Flex>

            {/* 단계별 헤더 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <Flex justify="between" align="center" className="mb-3">
                <Text size="2" weight="medium" color="gray">단계별 설정</Text>
                <Text size="1" color="gray">
                  {selectionStep === 'start' && '1/3'}
                  {selectionStep === 'end' && '2/3'}
                  {selectionStep === 'weekday' && '3/3'}
                </Text>
              </Flex>
              
              <Flex gap="2" className="mb-3">
                <button
                  onClick={() => handleStepClick('start')}
                  className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors ${
                    selectionStep === 'start' 
                      ? 'text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  style={selectionStep === 'start' ? { backgroundColor: 'var(--accent-9)' } : {}}
                >
                  <Text size="2" weight="medium">시작일</Text>
                  {dateRange.start && (
                    <Text size="1" className="block mt-1 opacity-80">
                      {formatDate(dateRange.start)}
                    </Text>
                  )}
                </button>
                
                <button
                  onClick={() => handleStepClick('end')}
                  disabled={!dateRange.start}
                  className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors ${
                    !dateRange.start 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : selectionStep === 'end'
                        ? 'text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  style={!dateRange.start ? {} : selectionStep === 'end' ? { backgroundColor: 'var(--accent-9)' } : {}}
                >
                  <Text size="2" weight="medium">종료일</Text>
                  {dateRange.end && (
                    <Text size="1" className="block mt-1 opacity-80">
                      {formatDate(dateRange.end)}
                    </Text>
                  )}
                </button>
                
                <button
                  onClick={() => handleStepClick('weekday')}
                  disabled={!dateRange.start || !dateRange.end}
                  className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors ${
                    !dateRange.start || !dateRange.end
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : selectionStep === 'weekday'
                        ? 'text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  style={(!dateRange.start || !dateRange.end) ? {} : selectionStep === 'weekday' ? { backgroundColor: 'var(--accent-9)' } : {}}
                >
                  <Text size="2" weight="medium">제외 날짜</Text>
                  {selectedDates.size < getDatesBetween(dateRange.start!, dateRange.end!).length && (
                    <Text size="1" className="block mt-1 opacity-80">
                      {getDatesBetween(dateRange.start!, dateRange.end!).length - selectedDates.size}일 제외
                    </Text>
                  )}
                </button>
              </Flex>

              {/* 현재 단계 안내 */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <Text size="2" color="gray">
                  {selectionStep === 'start' && '시작일을 선택해주세요'}
                  {selectionStep === 'end' && '종료일을 선택해주세요'}
                  {selectionStep === 'weekday' && '제외할 날짜를 선택해주세요. 요일 헤더를 터치하거나 개별 날짜를 터치할 수 있습니다.'}
                </Text>
              </div>
            </div>

            {/* 캘린더 */}
            <Flex direction="column" gap="3">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                {/* 년월 표시 */}
                <div className="flex items-center justify-center gap-8 mb-4">
                <Button 
                  variant="ghost" 
                  size="3"
                  onClick={handlePrevMonth}
                  className="p-3"
                >
                  <ChevronLeftIcon width={20} height={20} />
                </Button>
                <Text size="3" weight="medium">
                  {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                </Text>
                <Button 
                  variant="ghost" 
                  size="3"
                  onClick={handleNextMonth}
                  className="p-3"
                >
                  <ChevronRightIcon width={20} height={20} />
                </Button>
              </div>

              {/* 캘린더 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                  <button
                    key={day}
                    onClick={() => {
                      if (selectionStep === 'weekday') {
                        toggleWeekday(index);
                      }
                    }}
                    className={`text-center py-2 rounded-lg transition-colors ${
                      selectionStep === 'weekday'
                        ? weekdayFilter[index]
                          ? 'text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        : 'text-gray-700'
                    }`}
                    style={
                      selectionStep === 'weekday'
                        ? weekdayFilter[index]
                          ? { backgroundColor: 'var(--accent-9)' }
                          : { backgroundColor: 'var(--gray-3)' }
                        : {}
                    }
                  >
                    <Text size="1" weight="medium">{day}</Text>
                  </button>
                ))}
              </div>

              {/* 캘린더 바디 */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, index) => {
                  const date = new Date(currentMonth);
                  date.setDate(1);
                  date.setDate(date.getDate() + index - date.getDay());

                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isPast = date < new Date();
                  const dateString = toLocalDateString(date);
                  const dayOfWeek = date.getDay();

                  // 범위 선택을 위한 스타일링
                  const isStart = dateRange.start === dateString;
                  const isEnd = dateRange.end === dateString;
                  const hasRange = dateRange.start && dateRange.end;
                  const startDate = hasRange ? new Date(dateRange.start!) : null;
                  const endDate = hasRange ? new Date(dateRange.end!) : null;
                  const isInRange = hasRange && startDate && endDate && 
                    date >= (startDate < endDate ? startDate : endDate) && 
                    date <= (startDate < endDate ? endDate : startDate);

                  // 요일 필터 단계에서의 스타일링
                  const isInSelectedRange = hasRange && startDate && endDate && 
                    (dateString >= dateRange.start! && dateString <= dateRange.end!);
                  const isWeekdayFiltered = selectionStep === 'weekday' && isInSelectedRange && weekdayFilter[dayOfWeek];
                  const isDateSelected = selectedDates.has(dateString);

                  let cellClass = '';
                  let cellStyle = {};

                  if (!isCurrentMonth || isPast) {
                    cellClass = 'text-gray-300 cursor-not-allowed';
                  } else if (selectionStep === 'weekday') {
                    // 요일 필터 단계
                    if (isStart || isEnd) {
                      // 시작일/종료일은 항상 선택된 상태로 표시
                      if (isDateSelected) {
                        // 개별 선택된 시작일/종료일 - 활성 상태
                        cellClass = 'text-white';
                        cellStyle = { backgroundColor: 'var(--accent-9)' };
                      } else {
                        // 개별 선택되지 않은 시작일/종료일 - 비활성 상태
                        cellClass = 'text-white';
                        cellStyle = { backgroundColor: 'var(--accent-6)' };
                      }
                    } else if (isInSelectedRange) {
                      // 일반 날짜들
                      if (isDateSelected) {
                        // 개별 선택된 날짜들
                        cellClass = 'text-accent-11';
                        cellStyle = { backgroundColor: 'var(--accent-4)' };
                      } else {
                        // 개별 선택되지 않은 날짜들
                        cellClass = 'text-gray-400';
                        cellStyle = { backgroundColor: 'var(--gray-3)' };
                      }
                    } else {
                      cellClass = 'text-gray-300';
                    }
                  } else {
                    // 날짜 선택 단계
                    if (isStart || isEnd) {
                      cellClass = 'text-white';
                      cellStyle = { backgroundColor: 'var(--accent-9)' };
                    } else if (isInRange) {
                      cellClass = 'text-accent-11';
                      cellStyle = { backgroundColor: 'var(--accent-4)' };
                    } else {
                      cellClass = 'hover:bg-gray-100';
                    }
                  }

                  return (
                    <button
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-lg transition-colors ${cellClass}`}
                      style={cellStyle}
                      onClick={() => {
                        if (isCurrentMonth && !isPast) {
                          if (selectionStep === 'weekday') {
                            // 요일 필터 단계에서는 범위 내 날짜만 클릭 가능
                            if (isInSelectedRange) {
                              toggleDate(dateString);
                            }
                          } else {
                            // 날짜 선택 단계
                            handleDateSelection(dateString);
                          }
                        }
                      }}
                      disabled={!isCurrentMonth || isPast}
                    >
                        <Text 
                          size="2" 
                          weight={isToday ? "bold" : "medium"}
                          className={isToday && !isStart && !isEnd && !isWeekdayFiltered && (selectionStep !== 'weekday' || isInSelectedRange) ? "underline" : ""}
                          style={isToday && !isPast && !isStart && !isEnd && !isWeekdayFiltered && (selectionStep !== 'weekday' || isInSelectedRange) ? { color: 'var(--accent-9)' } : {}}
                        >
                        {date.getDate()}
                      </Text>
                    </button>
                  );
                })}
              </div>
            </div>
            </Flex>

            <Flex gap="3" className="mt-4">
              <Button
                onClick={confirmDateSelection}
                disabled={!dateRange.start || !dateRange.end}
                className="flex-1"
              >
                확인
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* 선호 시간대 설정 다이얼로그 */}
      <Dialog.Root open={isPreferredHoursDialogOpen} onOpenChange={setIsPreferredHoursDialogOpen}>
        <Dialog.Content>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Dialog.Title className="flex items-center">선호 시간대 설정</Dialog.Title>
              <Button
                variant="ghost"
                size="2"
                onClick={() => setIsPreferredHoursDialogOpen(false)}
                className="flex items-center gap-1 self-center -mt-4"
              >
                <X size={16} />
                <Text size="2" weight="medium">닫기</Text>
              </Button>
            </Flex>
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium" className="mb-2">시간대 선택</Text>

              <Flex gap="3" align="center" justify="center">
                <Select.Root
                  value={form.preferredHours.start}
                  onValueChange={(value) => setForm(prev => ({
                    ...prev,
                    preferredHours: { ...prev.preferredHours, start: value }
                  }))}
                >
                  <Select.Trigger className="h-10 text-lg px-6" />
                  <Select.Content>
                    {timeSlots.map((time) => (
                      <Select.Item key={time} value={time}>{time}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text size="2" color="gray">부터</Text>
                <Select.Root
                  value={form.preferredHours.end}
                  onValueChange={(value) => setForm(prev => ({
                    ...prev,
                    preferredHours: { ...prev.preferredHours, end: value }
                  }))}
                >
                  <Select.Trigger className="h-10 text-lg px-6" />
                  <Select.Content>
                    {timeSlots.map((time) => (
                      <Select.Item key={time} value={time}>{time}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text size="2" color="gray">까지</Text>
              </Flex>
            </Flex>

            <Flex gap="3" className="mt-4">
              <Button
                onClick={() => setIsPreferredHoursDialogOpen(false)}
                className="flex-1"
              >
                확인
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* 바우처 사용 확인 다이얼로그 */}
      <Dialog.Root open={isVoucherDialogOpen} onOpenChange={setIsVoucherDialogOpen}>
        <Dialog.Content>
          <Dialog.Title>바우처 사용 안내</Dialog.Title>
          <Dialog.Description>
            <Flex direction="column" gap="3">
              <Text>
                이번 신청으로 인한 예상 사용 금액은 {form.estimatedUsage.toLocaleString()}원입니다.
              </Text>
              <Text size="1" color="gray">
                상세한 바우처 현황은 프로필 페이지에서 확인하실 수 있습니다.
              </Text>
            </Flex>
          </Dialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                취소
              </Button>
            </Dialog.Close>
            <Button onClick={handleVoucherConfirm}>
              계속 진행
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Container>
  );
}
