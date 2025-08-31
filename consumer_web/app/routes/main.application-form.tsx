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
  Badge
} from "@radix-ui/themes";
import {
  Info,
  X
} from "lucide-react";
import { DatePickerDialog } from "../components/DatePicker";
import { VoucherInfoDisplay } from "../components/VoucherInfo";

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
  requestedDates: string[]; // 요청 일자 (단일 날짜, YYYY-MM-DD 형식)
  startTime: string; // 시작 시간
  preferredAreas: string[];
}

const serviceTypes: ServiceType[] = [
  { value: 'visiting-care', label: '방문요양서비스', description: '가정을 방문하여 일상생활 지원' },
  { value: 'day-night-care', label: '주야간보호서비스', description: '주간 또는 야간 보호 서비스' },
  { value: 'respite-care', label: '단기보호서비스', description: '일시적인 보호 서비스' },
  { value: 'visiting-bath', label: '방문목욕서비스', description: '가정 방문 목욕 서비스' },
  { value: 'in-home-support', label: '재가노인지원서비스', description: '재가 노인을 위한 종합 지원' },
  { value: 'visiting-nursing', label: '방문간호서비스', description: '전문 간호 서비스' },
];

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];



export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const [isPreferredDaysDialogOpen, setIsPreferredDaysDialogOpen] = useState(false);
  const [isPreferredHoursDialogOpen, setIsPreferredHoursDialogOpen] = useState(false);
  const [isDurationDialogOpen, setIsDurationDialogOpen] = useState(false);
  const [isApplicationConfirmDialogOpen, setIsApplicationConfirmDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  


  const [form, setForm] = useState<ApplicationForm>({
    serviceType: '',
    address: '',
    specialRequests: '',
    estimatedUsage: 0,
    duration: 120, // 기본 2시간 (분 단위)
    requestedDates: [], // 빈 배열로 시작 (단일 날짜)
    startTime: '09:00', // 기본 시작 시간
    preferredAreas: ['서울시 강남구']
  });



  useEffect(() => {
    // 예상 사용량 계산 (서비스 유형과 소요시간에 따라)
    let estimatedCost = 0;
    if (form.serviceType) {
      // 간단한 예상 비용 계산 (실제로는 더 복잡한 로직 필요)
      const baseHourlyRate = 15000; // 기본 시급 (시간당)
      const durationInHours = form.duration / 60; // 분을 시간으로 변환
      estimatedCost = baseHourlyRate * durationInHours;
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

    // 신청서 확인 다이얼로그 열기
    setIsApplicationConfirmDialogOpen(true);
  };

  const handleConfirmApplication = async () => {
    setIsApplicationConfirmDialogOpen(false);
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

  const handleEditApplication = () => {
    setIsApplicationConfirmDialogOpen(false);
  };

  // 날짜 선택 다이얼로그 핸들러
  const handleDateConfirm = (dates: string[]) => {
    // 단일 날짜만 사용 (첫 번째 날짜)
    const selectedDate = dates.length > 0 ? [dates[0]] : [];
    setForm(prev => ({ ...prev, requestedDates: selectedDate }));
    setIsPreferredDaysDialogOpen(false);
  };

  const handleDateDialogClose = () => {
    setIsPreferredDaysDialogOpen(false);
  };

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
                        const selectedDate = form.requestedDates[0];
                        const date = new Date(selectedDate);
                        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
                      })()}
                    </>
                  ) : (
                    '선택해주세요'
                  )}
                </Text>
              </Flex>
            </div>

            {/* 시작 시간 */}
            <div className="space-y-2">
              <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsPreferredHoursDialogOpen(true)}>
                <Text size="2" weight="medium">시작 시간</Text>
                <Text size="2" color="gray">{form.startTime}</Text>
              </Flex>
            </div>

            {/* 1회 소요시간 */}
            <div className="space-y-2">
              <Flex justify="between" align="center" className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsDurationDialogOpen(true)}>
                <Text size="2" weight="medium">1회 소요시간</Text>
                <Text size="2" color="gray">
                  {form.duration >= 60 ? 
                    `${Math.floor(form.duration / 60)}시간${form.duration % 60 > 0 ? ` ${form.duration % 60}분` : ''}` : 
                    `${form.duration}분`
                  }
                </Text>
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
      <VoucherInfoDisplay 
        estimatedUsage={form.estimatedUsage}
        variant="floating"
      />

      {/* 신청서 확인 다이얼로그 */}
      <Dialog.Root open={isApplicationConfirmDialogOpen} onOpenChange={setIsApplicationConfirmDialogOpen}>
        <Dialog.Content className="max-w-md">
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Dialog.Title className="flex items-center">신청서 확인</Dialog.Title>
              <Button
                variant="ghost"
                size="2"
                onClick={() => setIsApplicationConfirmDialogOpen(false)}
                className="flex items-center gap-1 self-center -mt-4"
              >
                <X size={16} />
                <Text size="2" weight="medium">닫기</Text>
              </Button>
            </Flex>
            
            {/* 안내 멘트 */}
            <Text size="3" color="gray">
              작성하신 신청서를 검토해 주세요.<br/>수정이 필요하다면 수정하기를 눌러주세요.
            </Text>
            
            {/* 신청서 내용 카드 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <Flex direction="column" gap="4">
                {/* 서비스 유형 및 기간 */}
                <div>
                  <Flex justify="between" align="center">
                    <Text size="2" weight="medium">서비스 유형</Text>
                    <Badge color="blue">
                      {serviceTypes.find(s => s.value === form.serviceType)?.label || form.serviceType}
                    </Badge>
                  </Flex>
                </div>

                <div className="w-full h-px bg-gray-200"></div>

                {/* 날짜 및 시간 */}
                <div>
                  <Flex justify="between" align="center" className="mb-4">
                    <Text size="2" weight="medium">서비스 날짜</Text>
                    <Text size="2" color="gray">
                      {form.requestedDates.length > 0 ? (
                        (() => {
                          const selectedDate = form.requestedDates[0];
                          const date = new Date(selectedDate);
                          return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
                        })()
                      ) : (
                        '선택되지 않음'
                      )}
                    </Text>
                  </Flex>
                  <Flex justify="between" align="center">
                    <Text size="2" weight="medium">서비스 시간</Text>
                    <Text size="2" color="gray">
                      {form.startTime}부터 {
                        form.duration >= 60 ? 
                          `${Math.floor(form.duration / 60)}시간${form.duration % 60 > 0 ? ` ${form.duration % 60}분` : ''}` : 
                          `${form.duration}분`
                      }
                    </Text>
                  </Flex>
                  <Flex justify="between" align="center" className="mt-4">
                    <Text size="2" weight="medium">1회 소요시간</Text>
                    <Text size="2" color="gray">
                      {form.duration >= 60 ? 
                        `${Math.floor(form.duration / 60)}시간${form.duration % 60 > 0 ? ` ${form.duration % 60}분` : ''}` : 
                        `${form.duration}분`
                      }
                    </Text>
                  </Flex>
                </div>

                <div className="w-full h-px bg-gray-200"></div>

                {/* 주소 */}
                <div>
                  <Flex justify="between" align="center">
                    <Text size="2" weight="medium">서비스 주소</Text>
                    <Text size="2">{form.address}</Text>
                  </Flex>
                </div>

                {/* 특별 요청사항이 있는 경우에만 표시 */}
                {form.specialRequests && (
                  <>
                    <div className="w-full h-px bg-gray-200"></div>
                    <div>
                      <div><Text size="2" weight="medium" className="mb-3">특별 요청사항</Text></div>
                      <div><Text size="2" className="leading-relaxed whitespace-pre-line">{form.specialRequests}</Text></div>
                    </div>
                  </>
                )}
              </Flex>
            </div>

            {/* 버튼 */}
            <Flex gap="3" className="mt-4">
              <Button
                variant="outline"
                onClick={handleEditApplication}
                className="flex-1"
              >
                수정하기
              </Button>
              <Button
                onClick={handleConfirmApplication}
                className="flex-1"
              >
                후보 보기
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

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
              <Text size="2" weight="medium" className="mb-2">시간 선택 (30분 단위)</Text>

              <div className="grid grid-cols-3 gap-3">
                {[60, 90, 120, 150, 180, 210, 240].map((minutes) => (
                  <button
                    key={minutes}
                    className={`py-3 px-4 rounded-lg text-center cursor-pointer transition-colors ${form.duration === minutes
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    style={{
                      backgroundColor: form.duration === minutes
                        ? 'var(--accent-9)'
                        : 'var(--gray-3)'
                    }}
                    onClick={() => setForm(prev => ({ ...prev, duration: minutes }))}
                  >
                    <Text size="2" weight="medium">
                      {minutes >= 60 ? 
                        `${Math.floor(minutes / 60)}시간${minutes % 60 > 0 ? ` ${minutes % 60}분` : ''}` : 
                        `${minutes}분`
                      }
                    </Text>
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
      <DatePickerDialog
        open={isPreferredDaysDialogOpen}
        onOpenChange={setIsPreferredDaysDialogOpen}
        selectedDates={form.requestedDates}
        onConfirm={handleDateConfirm}
        onClose={handleDateDialogClose}
        mode="single"
        title="요청 일자 선택"
      />

      {/* 시작 시간 설정 다이얼로그 */}
      <Dialog.Root open={isPreferredHoursDialogOpen} onOpenChange={setIsPreferredHoursDialogOpen}>
        <Dialog.Content>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Dialog.Title className="flex items-center">시작 시간 설정</Dialog.Title>
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
              <Text size="2" weight="medium" className="mb-2">시작 시간 선택</Text>

              <Flex gap="3" align="center" justify="center">
                <Select.Root
                  value={form.startTime}
                  onValueChange={(value) => setForm(prev => ({
                    ...prev,
                    startTime: value
                  }))}
                >
                  <Select.Trigger className="h-10 text-lg px-6" />
                  <Select.Content>
                    {timeSlots.map((time) => (
                      <Select.Item key={time} value={time}>{time}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text size="2" color="gray">부터 시작</Text>
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


    </Container>
  );
}
