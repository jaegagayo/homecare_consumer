import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
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
  TimeRangeSelector,
  TimeRangeSettingDialog,
  DateRangeSelector,
  ServiceInfoCard
} from "../components/RegularServiceForm";
import { createRecurringOffer } from "../api/recurringOffer";
import { apiUtils } from "../api/utils";
import { getScheduleDetail } from "../api/schedule";
import { RegularServiceForm } from "../types/application";
import { DayOfWeek } from "../types/home";
import { ConsumerScheduleDetailResponse } from "../types/schedule";

interface RecommendationData {
  id: string;
  dayOfWeek: string;
  timeSlot: string;
  period: string;
  caregiverName: string;
  serviceType: string;
  reviewRating: number;
  caregiverPhone: string;
}

export default function RegularServiceProposalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceMatchId = searchParams.get('serviceMatchId');



  const [isPreferredDaysDialogOpen, setIsPreferredDaysDialogOpen] = useState(false);
  const [isPreferredHoursDialogOpen, setIsPreferredHoursDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null);
  const [estimatedUsage, setEstimatedUsage] = useState(0);

  const [form, setForm] = useState<RegularServiceForm>({
    caregiverId: '', // 추천 데이터에서 가져올 예정
    consumerId: '', // API에서 가져올 예정
    serviceType: 'VISITING_CARE',
    serviceAddress: '',
    addressType: 'ROAD',
    location: {
      latitude: 37.5665, // 서울시청 기본 위도
      longitude: 126.9780 // 서울시청 기본 경도
    },
    dayOfWeek: [],
    serviceStartDate: '',
    serviceEndDate: '',
    serviceStartTime: '09:00:00',
    serviceEndTime: '11:00:00'
  });



  // serviceMatchId로 스케줄 상세 정보 조회
  useEffect(() => {
    if (serviceMatchId) {
      const loadScheduleDetail = async () => {
        try {
          const scheduleData = await getScheduleDetail(serviceMatchId);
          
          // 스케줄 데이터로 추천 정보 생성
          const recommendationData: RecommendationData = {
            id: serviceMatchId,
            dayOfWeek: getDayOfWeek(scheduleData.serviceDate),
            timeSlot: `${scheduleData.serviceStartTime} - ${scheduleData.serviceEndTime}`,
            period: "3개월",
            caregiverName: scheduleData.caregiverName,
            serviceType: scheduleData.serviceType,
            reviewRating: 4.5, // 기본값
            caregiverPhone: scheduleData.caregiverPhone || '연락처 정보 없음'
          };
          
          setRecommendationData(recommendationData);
          initializeFormFromScheduleData(scheduleData);
        } catch (error) {
          console.error('일정 정보 조회 실패:', error);
          // 에러 처리
        }
      };
      
      loadScheduleDetail();
    }
  }, [serviceMatchId]);

  // 요일 변환 헬퍼 함수
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return days[date.getDay()];
  };

  // 일정 데이터로부터 폼 초기화하는 함수
  const initializeFormFromScheduleData = (scheduleData: ConsumerScheduleDetailResponse) => {
    // 기간을 날짜로 변환 (현재 날짜 기준)
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + (3 * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]; // 3개월 후

    setForm({
      caregiverId: '', // 추천 데이터에서 가져올 예정
      consumerId: '', // API에서 가져올 예정
      serviceType: scheduleData.serviceType || 'VISITING_CARE',
      serviceAddress: scheduleData.serviceAddress || '서울시 강남구 테헤란로 123',
      addressType: 'ROAD',
      location: {
        latitude: 37.5665, // 기본값 (실제로는 주소로부터 좌표 변환 필요)
        longitude: 126.9780 // 기본값 (실제로는 주소로부터 좌표 변환 필요)
      },
      dayOfWeek: ['MONDAY'] as DayOfWeek[], // 기본값
      serviceStartDate: startDate,
      serviceEndDate: endDate,
      serviceStartTime: scheduleData.serviceStartTime || '09:00:00',
      serviceEndTime: scheduleData.serviceEndTime || '11:00:00'
    });
  };



    useEffect(() => {
    // 예상 사용량 계산 (서비스 유형과 소요시간에 따라)
    let estimatedCost = 0;
    if (form.serviceType && form.serviceStartTime && form.serviceEndTime) {
      const baseHourlyRate = 15000; // 기본 시급
      
      // 시작/종료 시간 차이로 duration 계산
      const startTime = new Date(`2000-01-01T${form.serviceStartTime}`);
      const endTime = new Date(`2000-01-01T${form.serviceEndTime}`);
      const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      const daysBetween = form.serviceStartDate && form.serviceEndDate ? 
        Math.ceil((new Date(form.serviceEndDate).getTime() - new Date(form.serviceStartDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
      estimatedCost = baseHourlyRate * durationInHours * daysBetween;
    }

    // estimatedUsage는 form에 저장하지 않고 별도 상태로 관리
    setEstimatedUsage(estimatedCost);
  }, [form.serviceType, form.serviceStartTime, form.serviceEndTime, form.serviceStartDate, form.serviceEndDate]);

  const handleSubmit = async () => {
    if (!form.serviceType || !form.serviceStartDate || !form.serviceEndDate) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // caregiverId는 추천 데이터에서 가져오기 (실제로는 추천 API에서 가져와야 함)
      const caregiverId = recommendationData?.id || 'temp-caregiver-id';

      // form에 필요한 필드들만 추가하여 API 호출
      const requestData = {
        ...form,
        caregiverId,
        consumerId: apiUtils.getConsumerId()
      };

      // 정기 서비스 요청 API 호출
      await createRecurringOffer(requestData);

      alert('정기 서비스 요청이 등록되었습니다.');
      navigate('/main/home'); // 홈으로 이동하여 승인대기 상태 확인
    } catch (error) {
      console.error('정기 서비스 요청 오류:', error);
      if (error instanceof Error && error.message.includes('Consumer ID not found')) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        alert('정기 서비스 요청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 날짜 선택 다이얼로그 핸들러 (복수 날짜)
  const handleDateConfirm = (dates: string[]) => {
    if (dates.length >= 2) {
      setForm(prev => ({
        ...prev,
        serviceStartDate: dates[0],
        serviceEndDate: dates[dates.length - 1]
      }));
    }
    setIsPreferredDaysDialogOpen(false);
  };

  const handleDateDialogClose = () => {
    setIsPreferredDaysDialogOpen(false);
  };

  if (!recommendationData) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text>추천 정보를 불러오는 중...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 정기 서비스 신청서 */}
        <div className="space-y-6">
          <div>
            <Heading size="5" >정기 신청 조건을 확인해주세요</Heading>
            <Text size="3" color="gray">
              해당 요양보호사가 수락 시 정기 일정이 등록됩니다.
            </Text>
          </div>

          {/* 서비스 정보 (읽기 전용) */}
          <ServiceInfoCard
            recommendationData={recommendationData}
            address={form.serviceAddress}
          />

          {/* 매칭 조건 */}
          <div className="space-y-4">
            <div>
              <Heading size="3">정기 신청 조건 *</Heading>
              <Text size="2" color="gray">해당 부분을 눌러서 변경할 수 있습니다.</Text>
            </div>

            {/* 서비스 기간 */}
            <DateRangeSelector
              requestedDates={[form.serviceStartDate, form.serviceEndDate].filter(Boolean)}
              onClick={() => setIsPreferredDaysDialogOpen(true)}
            />

            {/* 가능한 시간대 */}
            <TimeRangeSelector
              startTime={form.serviceStartTime.substring(0, 5)}
              endTime={form.serviceEndTime.substring(0, 5)}
              onClick={() => setIsPreferredHoursDialogOpen(true)}
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <Flex gap="3" className="mt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/main/home')}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !form.serviceType || !form.serviceStartDate || !form.serviceEndDate}
            className="flex-1"
          >
            {isSubmitting ? '등록 중...' : '정기 신청'}
          </Button>
        </Flex>

        {/* 플로팅 카드 공간 확보 - 바우처 현황 카드 높이를 고려하여 여백 증가 */}
        <div className="h-32"></div>
      </Flex>

      {/* 플로팅 바우처 정보 */}
      <VoucherInfoDisplay 
        estimatedUsage={estimatedUsage}
        variant="floating"
      />



      {/* 서비스 기간 설정 다이얼로그 */}
      <DatePickerDialog
        open={isPreferredDaysDialogOpen}
        onOpenChange={setIsPreferredDaysDialogOpen}
        selectedDates={[form.serviceStartDate, form.serviceEndDate].filter(Boolean)}
        onConfirm={handleDateConfirm}
        onClose={handleDateDialogClose}
        mode="range"
        title="서비스 기간 선택"
      />

      {/* 선호 시간대 설정 다이얼로그 */}
      <TimeRangeSettingDialog
        open={isPreferredHoursDialogOpen}
        onOpenChange={setIsPreferredHoursDialogOpen}
        startTime={form.serviceStartTime.substring(0, 5)}
        endTime={form.serviceEndTime.substring(0, 5)}
        onTimeChange={(startTime, endTime) => setForm(prev => ({
          ...prev,
          serviceStartTime: startTime + ':00',
          serviceEndTime: endTime + ':00'
        }))}
      />
    </Container>
  );
}
