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
import { ApplicationForm } from "../types";
import { ServiceType } from "../types/home";
import { createServiceRequest } from "../api/serviceRequest";

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const [isPreferredDaysDialogOpen, setIsPreferredDaysDialogOpen] = useState(false);
  const [isPreferredHoursDialogOpen, setIsPreferredHoursDialogOpen] = useState(false);
  const [isDurationDialogOpen, setIsDurationDialogOpen] = useState(false);
  const [isApplicationConfirmDialogOpen, setIsApplicationConfirmDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedUsage, setEstimatedUsage] = useState(0);

  // 로그인된 사용자의 consumerId 가져오기
  const getConsumerId = (): string => {
    // TODO: 실제 로그인 상태 관리에서 consumerId 가져오기
    // 현재는 로컬 스토리지에서 가져오는 것으로 가정
    const consumerId = localStorage.getItem('consumerId');
    if (!consumerId) {
      throw new Error('로그인이 필요합니다.');
    }
    return consumerId;
  };

  // 주소 입력 시 위치 정보 업데이트 (간단한 예시)
  const updateLocationFromAddress = () => {
    // TODO: 실제로는 주소 검색 API를 사용하여 위도/경도를 가져와야 함
    // 현재는 기본값으로 설정
    setForm(prev => ({
      ...prev,
      location: {
        latitude: 37.5665, // 서울시청 기본 위도
        longitude: 126.9780 // 서울시청 기본 경도
      }
    }));
  };

  const [form, setForm] = useState<ApplicationForm>({
    serviceType: 'VISITING_CARE',
    serviceAddress: '',
    addressType: 'ROAD',
    location: {
      latitude: 37.5665, // 서울시청 기본 위도
      longitude: 126.9780 // 서울시청 기본 경도
    },
    requestDate: '',
    preferredStartTime: '09:00',
    preferredEndTime: '11:00',
    duration: 120, // 기본 2시간 (분 단위)
    additionalInformation: ''
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

    setEstimatedUsage(estimatedCost);
  }, [form.serviceType, form.duration]);

  // 종료 시간 자동 계산
  useEffect(() => {
    if (form.preferredStartTime && form.duration) {
      const startTime = new Date(`2000-01-01T${form.preferredStartTime}:00`);
      const endTime = new Date(startTime.getTime() + form.duration * 60 * 1000);
      const endTimeString = endTime.toTimeString().slice(0, 5); // HH:MM 형식
      
      setForm(prev => ({
        ...prev,
        preferredEndTime: endTimeString
      }));
    }
  }, [form.preferredStartTime, form.duration]);

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!form.serviceType) {
      alert('서비스 유형을 선택해주세요.');
      return;
    }
    
    if (!form.serviceAddress) {
      alert('서비스 주소를 입력해주세요.');
      return;
    }
    
    if (!form.requestDate) {
      alert('요청 일자를 선택해주세요.');
      return;
    }

    // 신청서 확인 다이얼로그 열기
    setIsApplicationConfirmDialogOpen(true);
  };

  const handleConfirmApplication = async () => {
    setIsApplicationConfirmDialogOpen(false);
    setIsLoading(true);

    try {
      // consumerId 설정
      const serviceRequest = {
        ...form,
        consumerId: getConsumerId()
      };

      // API 호출
      const result = await createServiceRequest(serviceRequest);

      // 성공 시 매칭 페이지로 이동
      navigate(`/main/matching?requestId=${result.serviceRequestId}`, { 
        state: { 
          applicationData: form,
          requestId: result.serviceRequestId,
          fromApplication: true 
        } 
      });
    } catch (error) {
      console.error('Service request creation error:', error);
      
      // 에러 타입에 따른 메시지 표시
      if (error instanceof Error) {
        if (error.message === '로그인이 필요합니다.') {
          alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
          return;
        }
      }
      
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
    const selectedDate = dates.length > 0 ? dates[0] : '';
    setForm(prev => ({ ...prev, requestDate: selectedDate }));
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
            onChange={(value) => setForm(prev => ({ ...prev, serviceType: value as ServiceType }))}
          />

          {/* 서비스 주소 */}
          <AddressInput 
            value={form.serviceAddress}
            onChange={(value) => {
              setForm(prev => ({ ...prev, serviceAddress: value }));
              updateLocationFromAddress();
            }}
          />

          {/* 매칭 조건 */}
          <div className="space-y-4">
            <div>
              <Heading size="3">매칭 조건 *</Heading>
              <Text size="2" color="gray">해당 부분을 눌러서 변경할 수 있습니다.</Text>
            </div>

            {/* 요청 일자 */}
            <DateSelector 
              requestedDates={form.requestDate ? [form.requestDate] : []}
              onClick={() => setIsPreferredDaysDialogOpen(true)}
            />

            {/* 시작 시간 */}
            <TimeRangeSelector 
              startTime={form.preferredStartTime || '09:00'}
              onStartTimeChange={(time: string) => setForm(prev => ({ ...prev, preferredStartTime: time }))}
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
            value={form.additionalInformation || ''}
            onChange={(value) => setForm(prev => ({ ...prev, additionalInformation: value }))}
          />
        </div>

        {/* 제출 버튼 */}
        <Button
          size="3"
          onClick={handleSubmit}
          disabled={isLoading || !form.serviceType || !form.serviceAddress || !form.requestDate}
          className="w-full"
        >
          {isLoading ? '저장 중...' : '후보 보기'}
        </Button>

        {/* 플로팅 카드 공간 확보 */}
        <div className="h-32"></div>
      </Flex>

      {/* 플로팅 바우처 정보 */}
      <VoucherInfoDisplay 
        estimatedUsage={estimatedUsage}
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
        selectedDates={form.requestDate ? [form.requestDate] : []}
        onConfirm={handleDateConfirm}
        onClose={handleDateDialogClose}
        mode="single"
        title="요청 일자 선택"
      />

      {/* 시작 시간 설정 다이얼로그 */}
      <TimeSettingDialog
        open={isPreferredHoursDialogOpen}
        onOpenChange={setIsPreferredHoursDialogOpen}
        startTime={form.preferredStartTime || '09:00'}
        onStartTimeChange={(time: string) => setForm(prev => ({ ...prev, preferredStartTime: time }))}
      />

    </Container>
  );
}
