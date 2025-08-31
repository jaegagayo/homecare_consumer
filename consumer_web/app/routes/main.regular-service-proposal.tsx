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
  DurationSelector,
  DurationSettingDialog,
  TimeRangeSelector,
  TimeRangeSettingDialog,
  DateRangeSelector,
  ServiceInfoCard,
  RecommendationInfoCard
} from "../components/RegularServiceForm";
import { createRecurringOffer } from "../api/recurringOffer";
import { apiUtils } from "../api/utils";

interface RegularServiceForm {
  // 기본 정보
  serviceType: 'VISITING_CARE' | 'VISITING_BATH' | 'VISITING_NURSING' | 'DAY_NIGHT_CARE' | 'RESPITE_CARE' | 'IN_HOME_SUPPORT';
  serviceAddress: string;
  addressType: 'ROAD' | 'JIBUN';
  location: {
    latitude: number;
    longitude: number;
  };

  // 바우처 정보 (간소화)
  estimatedUsage: number;

  // 조건 정보
  duration: number; // 1회 소요시간 (분 단위)
  serviceStartDate: string; // YYYY-MM-DD 형식
  serviceEndDate: string; // YYYY-MM-DD 형식
  serviceStartTime: string; // HH:mm:ss 형식
  serviceEndTime: string; // HH:mm:ss 형식
  dayOfWeek: string[]; // ['MONDAY', 'TUESDAY', ...]
}

interface RecommendationData {
  id: string;
  dayOfWeek: string;
  timeSlot: string;
  period: string;
  caregiverName: string;
  serviceType: string;
  reviewRating: number;
  caregiverGender: 'male' | 'female';
  caregiverAge: number;
  caregiverExperience: number;
}

export default function RegularServiceProposalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recommendationId = searchParams.get('recommendationId');
  
  // 리뷰에서 전달되는 파라미터들
  const serviceId = searchParams.get('serviceId');
  const caregiverName = searchParams.get('caregiverName');
  const serviceType = searchParams.get('serviceType');
  const serviceDate = searchParams.get('serviceDate');
  const serviceTime = searchParams.get('serviceTime');

  const [isPreferredDaysDialogOpen, setIsPreferredDaysDialogOpen] = useState(false);
  const [isPreferredHoursDialogOpen, setIsPreferredHoursDialogOpen] = useState(false);
  const [isDurationDialogOpen, setIsDurationDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null);

  const [form, setForm] = useState<RegularServiceForm>({
    serviceType: 'VISITING_CARE',
    serviceAddress: '',
    addressType: 'ROAD',
    location: {
      latitude: 37.5665, // 서울시청 기본 위도
      longitude: 126.9780 // 서울시청 기본 경도
    },
    estimatedUsage: 0,
    duration: 120, // 2시간 (분 단위)
    serviceStartDate: '',
    serviceEndDate: '',
    serviceStartTime: '09:00:00',
    serviceEndTime: '11:00:00',
    dayOfWeek: []
  });



  // 추천 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    if (recommendationId) {
      // 기존 추천 ID 기반 로직
      const mockRecommendationData: RecommendationData = {
        id: recommendationId,
        dayOfWeek: "월요일",
        timeSlot: "09:00 - 11:00",
        period: "3개월",
        caregiverName: "김요양사",
        serviceType: "방문요양",
        reviewRating: 4.5,
        caregiverGender: 'female',
        caregiverAge: 45,
        caregiverExperience: 8
      };

      setRecommendationData(mockRecommendationData);
      initializeFormFromRecommendation(mockRecommendationData);
    } else if (serviceId && caregiverName) {
      // 리뷰에서 전달된 파라미터 기반 추천 데이터 생성
      const getDayOfWeek = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        return days[date.getDay()];
      };

      const parseTimeSlot = (timeString: string) => {
        // "09:00-11:00" 형식을 "09:00 - 11:00" 형식으로 변환
        if (timeString && timeString.includes('-')) {
          return timeString.replace('-', ' - ');
        }
        return "09:00 - 11:00";
      };

      const reviewBasedRecommendation: RecommendationData = {
        id: serviceId,
        dayOfWeek: getDayOfWeek(serviceDate || new Date().toISOString()),
        timeSlot: parseTimeSlot(serviceTime || "09:00-11:00"),
        period: "3개월",
        caregiverName: caregiverName,
        serviceType: serviceType || "방문요양",
        reviewRating: 4.5, // 4점 이상이므로 높은 평점
        caregiverGender: 'female', // 기본값 또는 API에서 가져옴
        caregiverAge: 45, // 기본값 또는 API에서 가져옴
        caregiverExperience: 8 // 기본값 또는 API에서 가져옴
      };

      setRecommendationData(reviewBasedRecommendation);
      initializeFormFromRecommendation(reviewBasedRecommendation);
    }
  }, [recommendationId, serviceId, caregiverName, serviceType, serviceDate, serviceTime]);

  // 추천 데이터로부터 폼 초기화하는 함수
  const initializeFormFromRecommendation = (recommendation: RecommendationData) => {
    // 시간대 파싱
    const [startTime, endTime] = recommendation.timeSlot.split(' - ');
    
    // 요일을 요일 배열로 변환 (백엔드 형식: MONDAY, TUESDAY, ...)
    const dayMapping: { [key: string]: string } = {
      '월요일': 'MONDAY', '화요일': 'TUESDAY', '수요일': 'WEDNESDAY', '목요일': 'THURSDAY', 
      '금요일': 'FRIDAY', '토요일': 'SATURDAY', '일요일': 'SUNDAY'
    };

    // 기간을 날짜로 변환 (현재 날짜 기준)
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + (3 * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]; // 3개월 후

    setForm({
      serviceType: 'VISITING_CARE',
      serviceAddress: '서울시 강남구 테헤란로 123', // 실제로는 사용자 프로필에서 가져와야 함
      addressType: 'ROAD',
      location: {
        latitude: 37.5665, // 서울시청 기본 위도
        longitude: 126.9780 // 서울시청 기본 경도
      },
      estimatedUsage: 0,
      duration: 120, // 2시간 (분 단위)
      serviceStartDate: startDate,
      serviceEndDate: endDate,
      serviceStartTime: startTime + ':00',
      serviceEndTime: endTime + ':00',
      dayOfWeek: [dayMapping[recommendation.dayOfWeek] || 'MONDAY']
    });
  };

  useEffect(() => {
    // 예상 사용량 계산 (서비스 유형과 소요시간에 따라)
    let estimatedCost = 0;
    if (form.serviceType) {
      const baseHourlyRate = 15000; // 기본 시급
      const durationInHours = form.duration / 60; // 분을 시간으로 변환
      const daysBetween = form.serviceStartDate && form.serviceEndDate ? 
        Math.ceil((new Date(form.serviceEndDate).getTime() - new Date(form.serviceStartDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
      estimatedCost = baseHourlyRate * durationInHours * daysBetween;
    }

    setForm(prev => ({
      ...prev,
      estimatedUsage: estimatedCost
    }));
  }, [form.serviceType, form.duration, form.serviceStartDate, form.serviceEndDate]);

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

          {/* 추천 정보 */}
          <RecommendationInfoCard recommendationData={recommendationData} />

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

            {/* 1회 소요시간 */}
            <DurationSelector 
              duration={form.duration}
              onClick={() => setIsDurationDialogOpen(true)}
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
            {isSubmitting ? '등록 중...' : '정기 제안'}
          </Button>
        </Flex>

        {/* 플로팅 카드 공간 확보 */}
        <div className="h-20"></div>
      </Flex>

      {/* 플로팅 바우처 정보 */}
      <VoucherInfoDisplay 
        estimatedUsage={form.estimatedUsage}
        variant="floating"
      />

      {/* 1회 소요시간 설정 다이얼로그 */}
      <DurationSettingDialog
        open={isDurationDialogOpen}
        onOpenChange={setIsDurationDialogOpen}
        duration={form.duration}
        onDurationChange={(duration) => setForm(prev => ({ ...prev, duration }))}
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
