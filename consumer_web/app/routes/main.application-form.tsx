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
  Dialog,
  TextField
} from "@radix-ui/themes";
import { 
  CreditCard,
  Info
} from "lucide-react";

interface ServiceType {
  value: string;
  label: string;
  description: string;
}



interface ApplicationForm {
  // 기본 정보
  serviceType: string;
  date: string;
  time: string;
  address: string;
  specialRequests: string;
  
  // 바우처 정보 (간소화)
  estimatedUsage: number;
  
  // 조건 정보
  preferredDays: string[];
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
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState<ApplicationForm>({
    serviceType: '',
    date: '',
    time: '',
    address: '',
    specialRequests: '',
    estimatedUsage: 0,
    preferredDays: ['월', '화', '수', '목', '금'],
    preferredHours: { start: '09:00', end: '18:00' },
    preferredAreas: ['서울시 강남구']
  });

  // 바우처 정보 (실제로는 프로필에서 가져와야 함)
  const [voucherInfo] = useState<VoucherInfo>({
    selectedGrade: '3등급',
    voucherLimit: 1295400,
    currentUsage: 750000,
    selfPayAmount: 194310,
    isMedicalBenefitRecipient: false
  });

  useEffect(() => {
    // 예상 사용량 계산 (서비스 유형과 시간에 따라)
    let estimatedCost = 0;
    if (form.serviceType && form.time) {
      // 간단한 예상 비용 계산 (실제로는 더 복잡한 로직 필요)
      const baseHourlyRate = 15000; // 기본 시급
      const serviceHours = 2; // 기본 서비스 시간
      estimatedCost = baseHourlyRate * serviceHours;
    }
    
    setForm(prev => ({ 
      ...prev, 
      estimatedUsage: estimatedCost
    }));
  }, [form.serviceType, form.time]);





  const handleSubmit = async () => {
    if (!form.serviceType || !form.date || !form.time || !form.address) {
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
      // TODO: 실제 API 호출
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('서비스 요청이 성공적으로 접수되었습니다.');
      navigate('/main/matching');
    } catch (error) {
      alert('서비스 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoucherConfirm = () => {
    setIsVoucherDialogOpen(false);
    handleSubmit();
  };



  const handleDayToggle = (day: string) => {
    setForm(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }));
  };

  const handleWeekdaySelect = () => {
    const weekdays = ['월', '화', '수', '목', '금'];
    const allWeekdaysSelected = weekdays.every(day => form.preferredDays.includes(day));
    
    if (allWeekdaysSelected) {
      setForm(prev => ({
        ...prev,
        preferredDays: prev.preferredDays.filter(day => !weekdays.includes(day))
      }));
    } else {
      const nonWeekdays = form.preferredDays.filter(day => !weekdays.includes(day));
      setForm(prev => ({
        ...prev,
        preferredDays: [...nonWeekdays, ...weekdays]
      }));
    }
  };

  const handleWeekendSelect = () => {
    const weekends = ['토', '일'];
    const allWeekendsSelected = weekends.every(day => form.preferredDays.includes(day));
    
    if (allWeekendsSelected) {
      setForm(prev => ({
        ...prev,
        preferredDays: prev.preferredDays.filter(day => !weekends.includes(day))
      }));
    } else {
      const nonWeekends = form.preferredDays.filter(day => !weekends.includes(day));
      setForm(prev => ({
        ...prev,
        preferredDays: [...nonWeekends, ...weekends]
      }));
    }
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
            <Heading size="3" className="mb-2">서비스 신청서</Heading>
            <Text size="2" color="gray">
              원하시는 서비스 조건을 입력해주세요.
            </Text>
          </div>

          {/* 서비스 유형 선택 */}
          <div className="space-y-3">
            <Text size="2" weight="medium">서비스 유형 *</Text>
                         <Select.Root value={form.serviceType} onValueChange={(value) => setForm(prev => ({ ...prev, serviceType: value }))}>
               <Select.Trigger placeholder="서비스 유형을 선택하세요" className="w-full" />
               <Select.Content>
                 {serviceTypes.map((service) => (
                   <Select.Item key={service.value} value={service.value}>
                     {service.label}
                   </Select.Item>
                 ))}
               </Select.Content>
             </Select.Root>
          </div>

          {/* 서비스 일정 */}
          <div className="space-y-3">
            <Text size="2" weight="medium">서비스 일정 *</Text>
            <Flex gap="4" align="start">
              <div className="flex-1">
                <Text size="1" color="gray" className="mb-2 block">서비스 날짜</Text>
                <TextField.Root 
                  value={form.date}
                  onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="날짜를 선택하세요"
                  type="date"
                  className="w-full h-8"
                />
              </div>
              <div className="flex-1">
                <Text size="1" color="gray" className="mb-2 block">서비스 시간</Text>
                <Select.Root value={form.time} onValueChange={(value) => setForm(prev => ({ ...prev, time: value }))}>
                  <Select.Trigger 
                    placeholder="시간을 선택하세요"
                    className="w-full h-8"
                  />
                  <Select.Content>
                    {timeSlots.map((time) => (
                      <Select.Item key={time} value={time}>
                        {time}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </Flex>
          </div>

          {/* 서비스 주소 */}
          <div className="space-y-3">
            <Text size="2" weight="medium">서비스 주소 *</Text>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
              placeholder="서비스를 받을 주소를 입력하세요"
              className="w-full h-8 px-3 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* 선호 조건 */}
          <div className="space-y-4">
            <Text size="2" weight="medium">선호 조건</Text>
            
            {/* 선호 요일 */}
            <div className="space-y-2">
              <Text size="1" color="gray">선호 요일</Text>
              <Flex gap="2" wrap="wrap">
                <Button 
                  size="1" 
                  variant="outline" 
                  onClick={handleWeekdaySelect}
                >
                  평일 전체
                </Button>
                <Button 
                  size="1" 
                  variant="outline" 
                  onClick={handleWeekendSelect}
                >
                  주말 전체
                </Button>
              </Flex>
              <Flex gap="2" wrap="wrap">
                {daysOfWeek.map((day) => (
                  <Button
                    key={day}
                    size="1"
                    variant={form.preferredDays.includes(day) ? "solid" : "outline"}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day}
                  </Button>
                ))}
              </Flex>
            </div>

            {/* 선호 시간대 */}
            <div className="space-y-2">
              <Text size="1" color="gray">선호 시간대</Text>
              <Flex gap="2" align="center">
                <Select.Root 
                  value={form.preferredHours.start} 
                  onValueChange={(value) => setForm(prev => ({ 
                    ...prev, 
                    preferredHours: { ...prev.preferredHours, start: value } 
                  }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    {timeSlots.map((time) => (
                      <Select.Item key={time} value={time}>{time}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text>~</Text>
                <Select.Root 
                  value={form.preferredHours.end} 
                  onValueChange={(value) => setForm(prev => ({ 
                    ...prev, 
                    preferredHours: { ...prev.preferredHours, end: value } 
                  }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    {timeSlots.map((time) => (
                      <Select.Item key={time} value={time}>{time}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>
            </div>


          </div>

          {/* 특별 요청사항 */}
          <div className="space-y-3">
            <Text size="2" weight="medium">특별 요청사항</Text>
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
          disabled={isLoading || !form.serviceType || !form.date || !form.time || !form.address}
          className="w-full"
        >
          {isLoading ? '요청 중...' : '서비스 요청하기'}
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
