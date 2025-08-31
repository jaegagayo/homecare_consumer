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

interface RegularServiceForm {
  // 기본 정보
  serviceType: string;
  address: string;
  specialRequests: string;

  // 바우처 정보 (간소화)
  estimatedUsage: number;

  // 조건 정보
  duration: number; // 1회 소요시간
  requestedDates: string[]; // 요청 일자 (복수 날짜, YYYY-MM-DD 형식)
  preferredHours: {
    start: string;
    end: string;
  };
  preferredDays: string[]; // 선호 요일
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
    serviceType: 'visiting-care',
    address: '',
    specialRequests: '',
    estimatedUsage: 0,
    duration: 2,
    requestedDates: [],
    preferredHours: { start: '09:00', end: '11:00' },
    preferredDays: []
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
    
    // 요일을 요일 배열로 변환
    const dayMapping: { [key: string]: string } = {
      '월요일': '월', '화요일': '화', '수요일': '수', '목요일': '목', 
      '금요일': '금', '토요일': '토', '일요일': '일'
    };

    // 기간을 날짜로 변환 (현재 날짜 기준)
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + (3 * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]; // 3개월 후

    setForm({
      serviceType: 'visiting-care',
      address: '서울시 강남구 테헤란로 123', // 실제로는 사용자 프로필에서 가져와야 함
      specialRequests: '',
      estimatedUsage: 0,
      duration: 2,
      requestedDates: [startDate, endDate], // 시작일과 종료일
      preferredHours: { start: startTime, end: endTime },
      preferredDays: [dayMapping[recommendation.dayOfWeek] || '월']
    });
  };

  useEffect(() => {
    // 예상 사용량 계산 (서비스 유형과 소요시간에 따라)
    let estimatedCost = 0;
    if (form.serviceType) {
      const baseHourlyRate = 15000; // 기본 시급
      estimatedCost = baseHourlyRate * form.duration * form.requestedDates.length; // 날짜 수만큼 곱하기
    }

    setForm(prev => ({
      ...prev,
      estimatedUsage: estimatedCost
    }));
  }, [form.serviceType, form.duration, form.requestedDates.length]);

  const handleSubmit = async () => {
    if (!form.serviceType || form.requestedDates.length < 2) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: 정기 서비스 요청 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('정기 서비스 요청이 등록되었습니다.');
      navigate('/main/home'); // 홈으로 이동하여 승인대기 상태 확인
    } catch (error) {
      alert('정기 서비스 요청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 날짜 선택 다이얼로그 핸들러 (복수 날짜)
  const handleDateConfirm = (dates: string[]) => {
    setForm(prev => ({ ...prev, requestedDates: dates }));
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
            address={form.address}
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
              requestedDates={form.requestedDates}
              onClick={() => setIsPreferredDaysDialogOpen(true)}
            />

            {/* 가능한 시간대 */}
            <TimeRangeSelector 
              startTime={form.preferredHours.start}
              endTime={form.preferredHours.end}
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
            disabled={isSubmitting || !form.serviceType || form.requestedDates.length < 2}
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
        selectedDates={form.requestedDates}
        onConfirm={handleDateConfirm}
        onClose={handleDateDialogClose}
        mode="range"
        title="서비스 기간 선택"
      />

      {/* 선호 시간대 설정 다이얼로그 */}
      <TimeRangeSettingDialog
        open={isPreferredHoursDialogOpen}
        onOpenChange={setIsPreferredHoursDialogOpen}
        startTime={form.preferredHours.start}
        endTime={form.preferredHours.end}
        onTimeChange={(startTime, endTime) => setForm(prev => ({
          ...prev,
          preferredHours: { start: startTime, end: endTime }
        }))}
      />
    </Container>
  );
}
