import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  TextArea,
  Heading,
  Card,
  Select,
  Checkbox,
  Dialog,
  Badge,
  Callout
} from "@radix-ui/themes";
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  X,
  AlertTriangle,
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
  
  // 바우처 정보
  voucherLimit: number;
  currentUsage: number;
  isVoucherExceeded: boolean;
  
  // 조건 정보
  preferredDays: string[];
  preferredHours: {
    start: string;
    end: string;
  };
  preferredAreas: string[];
  maxHourlyRate: number;
  
  // 자연어 입력
  naturalLanguageInput: string;
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
  const [activeTab, setActiveTab] = useState<'natural' | 'structured'>('natural');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [isWorkDaysDialogOpen, setIsWorkDaysDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState<ApplicationForm>({
    serviceType: '',
    date: '',
    time: '',
    address: '',
    specialRequests: '',
    voucherLimit: 100000,
    currentUsage: 75000,
    isVoucherExceeded: false,
    preferredDays: ['월', '화', '수', '목', '금'],
    preferredHours: { start: '09:00', end: '18:00' },
    preferredAreas: ['서울시 강남구'],
    maxHourlyRate: 20000,
    naturalLanguageInput: ''
  });

  useEffect(() => {
    // 바우처 한도 체크
    const isExceeded = form.currentUsage >= form.voucherLimit;
    setForm(prev => ({ ...prev, isVoucherExceeded: isExceeded }));
  }, [form.currentUsage, form.voucherLimit]);



  const handleAnalyze = async () => {
    if (!form.naturalLanguageInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // TODO: 실제 AI 분석 로직 구현
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 분석 결과를 폼에 적용 (더미 데이터)
      setForm(prev => ({
        ...prev,
        serviceType: 'visiting-care',
        preferredDays: ['월', '화', '수', '목', '금'],
        preferredHours: { start: '09:00', end: '18:00' },
        maxHourlyRate: 15000
      }));
      
      setActiveTab('structured');
    } catch (error) {
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.serviceType || !form.date || !form.time || !form.address) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    // 바우처 한도 초과 시 확인
    if (form.isVoucherExceeded) {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '날짜 선택';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
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

  const remainingVoucher = form.voucherLimit - form.currentUsage;

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">

        {/* 바우처 정보 */}
        <Card className="p-4">
          <Flex justify="between" align="center" className="mb-3">
            <Text size="2" weight="medium">바우처 현황</Text>
            {form.isVoucherExceeded && (
              <Badge color="red">
                <AlertTriangle size={12} />
                한도 초과
              </Badge>
            )}
          </Flex>
          <Flex direction="column" gap="2">
            <Flex justify="between">
              <Text size="2" color="gray">사용 금액</Text>
              <Text size="2">{form.currentUsage.toLocaleString()}원</Text>
            </Flex>
            <Flex justify="between">
              <Text size="2" color="gray">한도</Text>
              <Text size="2">{form.voucherLimit.toLocaleString()}원</Text>
            </Flex>
            <Flex justify="between">
              <Text size="2" weight="medium">잔여</Text>
              <Text size="2" weight="medium" color={remainingVoucher < 0 ? "red" : "green"}>
                {remainingVoucher.toLocaleString()}원
              </Text>
            </Flex>
          </Flex>
          {form.isVoucherExceeded && (
            <Callout.Root color="red" className="mt-3">
              <Callout.Icon>
                <AlertTriangle size={16} />
              </Callout.Icon>
              <Callout.Text>
                바우처 한도를 초과했습니다. 부담금이 발생할 수 있습니다.
              </Callout.Text>
            </Callout.Root>
          )}
        </Card>

        {/* 입력 방식 선택 */}
        <Card className="p-4">
          <Flex gap="2">
            <Button 
              variant={activeTab === 'natural' ? 'solid' : 'outline'}
              onClick={() => setActiveTab('natural')}
              className="flex-1"
            >
              자연어 입력
            </Button>
            <Button 
              variant={activeTab === 'structured' ? 'solid' : 'outline'}
              onClick={() => setActiveTab('structured')}
              className="flex-1"
            >
              구조화 입력
            </Button>
          </Flex>
        </Card>

        {/* 자연어 입력 */}
        {activeTab === 'natural' && (
          <Card className="p-6">
            <Heading size="3" className="mb-4">자연어로 요청사항 입력</Heading>
            <Text size="2" color="gray" className="mb-4">
              원하는 서비스 조건을 자유롭게 작성해주세요. AI가 분석하여 자동으로 설정해드립니다.
            </Text>
            
            <Card className="p-4 mb-4 bg-gray-50">
              <Text size="2" weight="medium" className="mb-2 block">입력 예시</Text>
              <Text size="1" color="gray" className="leading-relaxed">
                • "평일 오전에 강남구에서 방문요양 하고 싶어요"<br/>
                • "시급은 15만원 정도면 좋겠어요"<br/>
                • "치매 케어 경험이 있어서 중증 어르신도 괜찮아요"<br/>
                • "야간은 어렵고, 평일 오전에만 가능해요"
              </Text>
            </Card>

            <TextArea
              placeholder="평일 오전 9시부터 6시까지 강남구, 서초구에서 방문요양 하고 싶어요. 시급은 15만원 정도면 좋겠고, 치매 케어 경험이 있어요."
              value={form.naturalLanguageInput}
              onChange={(e) => setForm(prev => ({ ...prev, naturalLanguageInput: e.target.value }))}
              className="min-h-32 mb-4"
            />

            <Button 
              onClick={handleAnalyze}
              disabled={!form.naturalLanguageInput.trim() || isAnalyzing}
              className="w-full"
              size="3"
            >
              {isAnalyzing ? '분석 중...' : '분석하기'}
            </Button>
          </Card>
        )}

        {/* 구조화 입력 */}
        {activeTab === 'structured' && (
          <Flex direction="column" gap="4">
            {/* 서비스 유형 선택 */}
            <Card className="p-6">
              <Heading size="3" className="mb-4">서비스 유형</Heading>
              <Select.Root value={form.serviceType} onValueChange={(value) => setForm(prev => ({ ...prev, serviceType: value }))}>
                <Select.Trigger placeholder="서비스 유형을 선택하세요" />
                <Select.Content>
                  {serviceTypes.map((service) => (
                    <Select.Item key={service.value} value={service.value}>
                      <Flex direction="column" align="start">
                        <Text weight="medium">{service.label}</Text>
                        <Text size="1" color="gray">{service.description}</Text>
                      </Flex>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Card>

            {/* 날짜 및 시간 선택 */}
            <Card className="p-6">
              <Heading size="3" className="mb-4">서비스 일정</Heading>
              <Flex direction="column" gap="4">
                <div>
                  <Text size="2" weight="medium" className="mb-2 block">서비스 날짜</Text>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <Text size="2" weight="medium" className="mb-2 block">서비스 시간</Text>
                  <Select.Root value={form.time} onValueChange={(value) => setForm(prev => ({ ...prev, time: value }))}>
                    <Select.Trigger placeholder="시간을 선택하세요" />
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
            </Card>

            {/* 주소 입력 */}
            <Card className="p-6">
              <Heading size="3" className="mb-4">서비스 주소</Heading>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="서비스를 받을 주소를 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </Card>

            {/* 선호 조건 */}
            <Card className="p-6">
              <Heading size="3" className="mb-4">선호 조건</Heading>
              <Flex direction="column" gap="4">
                {/* 선호 요일 */}
                <div>
                  <Text size="2" weight="medium" className="mb-2 block">선호 요일</Text>
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
                  <Flex gap="2" wrap="wrap" className="mt-2">
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
                <div>
                  <Text size="2" weight="medium" className="mb-2 block">선호 시간대</Text>
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

                {/* 최대 시급 */}
                <div>
                  <Text size="2" weight="medium" className="mb-2 block">최대 시급</Text>
                  <input
                    type="number"
                    value={form.maxHourlyRate}
                    onChange={(e) => setForm(prev => ({ ...prev, maxHourlyRate: parseInt(e.target.value) || 0 }))}
                    placeholder="최대 시급을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </Flex>
            </Card>

            {/* 특별 요청사항 */}
            <Card className="p-6">
              <Heading size="3" className="mb-4">특별 요청사항</Heading>
              <TextArea
                value={form.specialRequests}
                onChange={(e) => setForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="요양보호사에게 전달할 특별한 요청사항이 있다면 입력해주세요"
                className="w-full"
                rows={4}
              />
            </Card>
          </Flex>
        )}

        {/* 제출 버튼 */}
        <Button 
          size="3" 
          onClick={handleSubmit}
          disabled={isLoading || !form.serviceType || !form.date || !form.time || !form.address}
          className="w-full"
        >
          {isLoading ? '요청 중...' : '서비스 요청하기'}
        </Button>
      </Flex>

      {/* 바우처 한도 초과 확인 다이얼로그 */}
      <Dialog.Root open={isVoucherDialogOpen} onOpenChange={setIsVoucherDialogOpen}>
        <Dialog.Content>
          <Dialog.Title>바우처 한도 초과</Dialog.Title>
          <Dialog.Description>
            현재 바우처 한도를 초과하여 부담금이 발생할 수 있습니다. 
            계속 진행하시겠습니까?
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
