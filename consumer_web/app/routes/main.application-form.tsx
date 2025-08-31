import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Container,
  Flex,
  Text,
  Button,
  Heading
} from "@radix-ui/themes";
import { DatePickerDialog } from "../components/DatePicker";
import { VoucherInfoDisplay } from "../components/VoucherInfo";
import { 
  ServiceTypeSelector, 
  AddressInput, 
  TimeRangeSelector, 
  DurationSelector, 
  SpecialRequestsInput,
  ApplicationConfirmDialog,
  DurationSettingDialog,
  TimeSettingDialog,
  DateSelector
} from "../components/ApplicationForm";

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
          <ServiceTypeSelector 
            value={form.serviceType}
            onChange={(value) => setForm(prev => ({ ...prev, serviceType: value }))}
          />

          {/* 서비스 주소 */}
          <AddressInput 
            value={form.address}
            onChange={(value) => setForm(prev => ({ ...prev, address: value }))}
          />

          {/* 매칭 조건 */}
          <div className="space-y-4">
            <div>
              <Heading size="3">매칭 조건 *</Heading>
              <Text size="2" color="gray">해당 부분을 눌러서 변경할 수 있습니다.</Text>
            </div>

            {/* 요청 일자 */}
            <DateSelector 
              requestedDates={form.requestedDates}
              onClick={() => setIsPreferredDaysDialogOpen(true)}
            />

            {/* 시작 시간 */}
            <TimeRangeSelector 
              startTime={form.startTime}
              onStartTimeChange={(time) => setForm(prev => ({ ...prev, startTime: time }))}
              onClick={() => setIsPreferredHoursDialogOpen(true)}
            />

            {/* 1회 소요시간 */}
            <DurationSelector 
              duration={form.duration}
              onClick={() => setIsDurationDialogOpen(true)}
            />
          </div>

          {/* 특별 요청사항 */}
          <SpecialRequestsInput 
            value={form.specialRequests}
            onChange={(value) => setForm(prev => ({ ...prev, specialRequests: value }))}
          />
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
      <ApplicationConfirmDialog
        open={isApplicationConfirmDialogOpen}
        onOpenChange={setIsApplicationConfirmDialogOpen}
        form={form}
        onConfirm={handleConfirmApplication}
        onEdit={handleEditApplication}
      />

      {/* 1회 소요시간 설정 다이얼로그 */}
      <DurationSettingDialog
        open={isDurationDialogOpen}
        onOpenChange={setIsDurationDialogOpen}
        duration={form.duration}
        onDurationChange={(duration) => setForm(prev => ({ ...prev, duration }))}
      />

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
      <TimeSettingDialog
        open={isPreferredHoursDialogOpen}
        onOpenChange={setIsPreferredHoursDialogOpen}
        startTime={form.startTime}
        onStartTimeChange={(time) => setForm(prev => ({ ...prev, startTime: time }))}
      />


    </Container>
  );
}
