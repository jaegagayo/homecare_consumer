import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Heading,
  Card,
  Badge,
  Dialog,
  RadioCards
} from "@radix-ui/themes";
import { 
  Star,
  X,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";

interface Caregiver {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  experience: number;
  rating: number;
  koreanProficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
  specialCaseExperience: {
    dementia: boolean;
    bedridden: boolean;
  };
  outingAvailable: boolean;
  rejectionRate: number;
  selfIntroduction: string;
}

interface ServiceRequest {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  address: string;
  specialRequests: string;
  status: 'pending' | 'matched' | 'confirmed' | 'completed';
  matchedCaregiver?: Caregiver;
  totalDays?: number;
  requestedDates?: string[];
}

interface ApplicationForm {
  serviceType: string;
  address: string;
  specialRequests: string;
  estimatedUsage: number;
  duration: number;
  requestedDates: string[];
  preferredHours: {
    start: string;
    end: string;
  };
  preferredAreas: string[];
}

export default function MatchingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDateCalendarDialogOpen, setIsDateCalendarDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>('');
  
  // 신청서에서 전달받은 데이터 또는 기본 모킹 데이터
  const [applicationData] = useState<ApplicationForm>(() => {
    const state = location.state as { applicationData?: ApplicationForm; fromApplication?: boolean };
    
    if (state?.applicationData && state?.fromApplication) {
      // 신청서에서 전달받은 데이터 사용
      return state.applicationData;
    }
    
    // 기본 모킹 데이터
    return {
      serviceType: 'visiting-care',
      address: '서울시 강남구 역삼동 123-45',
      specialRequests: '계단이 있는 3층입니다. 보행기 사용이 필요합니다.',
      estimatedUsage: 30000,
      duration: 2,
      requestedDates: [
        '2025-08-18', '2025-08-19', '2025-08-20', 
        '2025-08-22', '2025-08-23', '2025-08-24', '2025-08-25',
        '2025-08-27', '2025-08-28', '2025-08-29', '2025-08-30',
        '2025-09-01', '2025-09-02', '2025-09-03'
      ],
      preferredHours: { start: '09:00', end: '11:00' },
      preferredAreas: [] // 신청서에는 선호 지역 선택 기능이 없으므로 빈 배열
    };
  });

  // 캘린더 다이얼로그가 열릴 때 요청 날짜가 있는 월로 이동
  useEffect(() => {
    if (isDateCalendarDialogOpen && applicationData.requestedDates.length > 0) {
      const firstRequestedDate = new Date(applicationData.requestedDates[0]);
      setCurrentMonth(new Date(firstRequestedDate.getFullYear(), firstRequestedDate.getMonth(), 1));
    }
  }, [isDateCalendarDialogOpen, applicationData.requestedDates]);

  useEffect(() => {
    // 더미 데이터 로드
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCaregivers([
        {
          id: "1",
          name: "김미영",
          gender: "female",
          age: 45,
          experience: 5,
          rating: 4.8,
          koreanProficiency: "native",
          specialCaseExperience: {
            dementia: true,
            bedridden: true
          },
          outingAvailable: true,
          rejectionRate: 2.3,
          selfIntroduction: "따뜻한 마음으로 환자님을 돌보겠습니다."
        },
        {
          id: "2",
          name: "박철수",
          gender: "male",
          age: 38,
          experience: 3,
          rating: 4.6,
          koreanProficiency: "advanced",
          specialCaseExperience: {
            dementia: false,
            bedridden: true
          },
          outingAvailable: false,
          rejectionRate: 5.1,
          selfIntroduction: "체계적이고 전문적인 케어를 제공합니다."
        },
        {
          id: "3",
          name: "이영희",
          gender: "female",
          age: 52,
          experience: 7,
          rating: 4.9,
          koreanProficiency: "native",
          specialCaseExperience: {
            dementia: true,
            bedridden: false
          },
          outingAvailable: true,
          rejectionRate: 1.8,
          selfIntroduction: "오랜 경험을 바탕으로 안전하고 믿을 수 있는 서비스를 제공합니다."
        }
      ]);

      // 신청서 데이터를 기반으로 하나의 통합된 서비스 요청 생성
      const sortedDates = [...applicationData.requestedDates].sort();
      const startDate = sortedDates[0];
      const endDate = sortedDates[sortedDates.length - 1];
      
      const serviceRequestFromApplication = {
        id: "application-request",
        serviceType: applicationData.serviceType === 'visiting-care' ? '방문요양' : 
                    applicationData.serviceType === 'day-night-care' ? '주야간보호' :
                    applicationData.serviceType === 'respite-care' ? '단기보호' :
                    applicationData.serviceType === 'visiting-bath' ? '방문목욕' :
                    applicationData.serviceType === 'in-home-support' ? '재가노인지원' :
                    applicationData.serviceType === 'visiting-nursing' ? '방문간호' : '방문요양',
        date: `${startDate} ~ ${endDate}`,
        time: `${applicationData.preferredHours.start}-${applicationData.preferredHours.end}`,
        address: applicationData.address,
        specialRequests: applicationData.specialRequests,
        status: "pending" as const,
        totalDays: applicationData.requestedDates.length,
        requestedDates: applicationData.requestedDates
      };

      setServiceRequests([serviceRequestFromApplication]);

      setIsLoading(false);
    };

    loadData();
  }, [applicationData]);

  const getKoreanProficiencyText = (level: string) => {
    switch (level) {
      case 'basic': return '기초';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      case 'native': return '원어민';
      default: return '알 수 없음';
    }
  };

  const getKoreanProficiencyColor = (level: string): "green" | "yellow" | "red" | "gray" => {
    switch (level) {
      case 'native': return 'green';
      case 'advanced': return 'green';
      case 'intermediate': return 'yellow';
      case 'basic': return 'red';
      default: return 'gray';
    }
  };



  const renderStars = (rating: number) => {
    return (
      <Flex gap="1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? "#fbbf24" : "none"}
            color={star <= rating ? "#fbbf24" : "#d1d5db"}
          />
        ))}
      </Flex>
    );
  };

  const handleConfirmSelection = () => {
    if (!selectedCaregiverId) {
      alert('보호사를 선택해주세요.');
      return;
    }
    
    // TODO: 실제 API 호출
    console.log(`선택된 보호사: ${selectedCaregiverId}`);
    
    // 선택된 보호사로 서비스 요청 상태 업데이트
    setServiceRequests(prev => prev.map(request => 
      request.id === "application-request" 
        ? { ...request, status: 'matched', matchedCaregiver: caregivers.find(c => c.id === selectedCaregiverId) }
        : request
    ));
    
    alert('요양보호사가 매칭되었습니다.');
  };

  if (isLoading) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text>로딩 중...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 헤더 */}
        <div>
          <Heading size="5">매칭 관리</Heading>
          <Text size="3" color="gray">
            서비스 요청에 맞는 요양보호사를 매칭하세요
          </Text>
        </div>

        {/* 신청서 섹션 */}
        <div>
          <Flex justify="between" align="center" className="mb-4">
            <Heading size="4">나의 신청서</Heading>
            <Button 
              size="2" 
              variant="outline"
              onClick={() => navigate('/main/change-options')}
            >
              변경하기
            </Button>
          </Flex>
          <Card className="p-4">
            <Flex direction="column" gap="4">
              {/* 서비스 유형 및 기간 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 유형</Text>
                  <Badge color="blue">{serviceRequests[0]?.serviceType}</Badge>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 날짜 및 시간 */}
              <div>
                <Flex justify="between" align="center" className="mb-2">
                  <Text size="2" weight="medium">서비스 기간</Text>
                  <Text size="2" color="gray">{serviceRequests[0]?.date} (총 {serviceRequests[0]?.totalDays}일)</Text>
                </Flex>
                <Flex justify="end" className="mb-2">
                  <Button 
                    size="1" 
                    variant="outline"
                    onClick={() => setIsDateCalendarDialogOpen(true)}
                  >
                    상세보기
                  </Button>
                </Flex>
                <div className="mb-4"></div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 시간</Text>
                  <Text size="2" color="gray">{serviceRequests[0]?.time}</Text>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 주소 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 주소</Text>
                  <Text size="2">{serviceRequests[0]?.address}</Text>
                </Flex>
              </div>

              {/* 특별 요청사항이 있는 경우에만 표시 */}
              {serviceRequests[0]?.specialRequests && (
                <>
                  <div className="w-full h-px bg-gray-200"></div>
                  <div>
                    <div><Text size="2" weight="medium" className="mb-3">특별 요청사항</Text></div>
                    <div><Text size="2" className="leading-relaxed whitespace-pre-line">{serviceRequests[0]?.specialRequests}</Text></div>
                  </div>
                </>
              )}
            </Flex>
          </Card>
        </div>

        {/* 요양보호사 선택 섹션 */}
        <div>
          <div className="mb-4">
            <Heading size="4">요양보호사 선택</Heading>
            <Text size="2" color="gray">
              카드를 눌러서 요양보호사를 선택할 수 있습니다.
            </Text>
          </div>
          {caregivers.length > 0 ? (
            <RadioCards.Root 
              value={selectedCaregiverId} 
              onValueChange={setSelectedCaregiverId}
              className="space-y-3"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {caregivers.map((caregiver) => (
                <RadioCards.Item key={caregiver.id} value={caregiver.id} className="w-full">
                  <Flex direction="column" gap="3" className="w-full">
                    {/* 기본 정보 */}
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="2">
                        <Text size="3" weight="medium">
                          {caregiver.name}
                        </Text>
                        <Text size="2" color="gray">
                          {caregiver.gender === 'female' ? '여' : '남'} / {caregiver.age}세 / 경력 {caregiver.experience}년
                        </Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        {renderStars(caregiver.rating)}
                        <Text size="2" color="gray">
                          {caregiver.rating}
                        </Text>
                      </Flex>
                    </Flex>

                    <div className="w-full h-px bg-gray-200"></div>
                    
                    {/* 상세 정보 - 2열 레이아웃 */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* 왼쪽 열 */}
                      <div className="space-y-3">
                        {/* 한국어 숙련도 */}
                        <div>
                          <Flex justify="between" align="center">
                            <Text size="2" weight="medium">한국어 숙련도</Text>
                            <Badge color={getKoreanProficiencyColor(caregiver.koreanProficiency)}>
                              {getKoreanProficiencyText(caregiver.koreanProficiency)}
                            </Badge>
                          </Flex>
                        </div>

                        <div className="w-full h-px bg-gray-200"></div>

                        {/* 특수케이스 경험도 */}
                        <div>
                          <Flex justify="between" align="center">
                            <Text size="2" weight="medium">특수</Text>
                            <Flex gap="2">
                              {caregiver.specialCaseExperience.dementia && (
                                <Badge color="blue">치매</Badge>
                              )}
                              {caregiver.specialCaseExperience.bedridden && (
                                <Badge color="purple">와상</Badge>
                              )}
                              {!caregiver.specialCaseExperience.dementia && !caregiver.specialCaseExperience.bedridden && (
                                <Text size="2" color="gray">없음</Text>
                              )}
                            </Flex>
                          </Flex>
                        </div>
                      </div>

                      {/* 오른쪽 열 */}
                      <div className="space-y-3">
                        {/* 외출 동행 가능 여부 */}
                        <div>
                          <Flex justify="between" align="center">
                            <Text size="2" weight="medium">외출 동행 가능 여부</Text>
                            <Badge color={caregiver.outingAvailable ? "green" : "red"}>
                              {caregiver.outingAvailable ? "가능" : "불가능"}
                            </Badge>
                          </Flex>
                        </div>

                        <div className="w-full h-px bg-gray-200"></div>

                        {/* 거절률 */}
                        <div>
                          <Flex justify="between" align="center">
                            <Text size="2" weight="medium">거절률</Text>
                            <Text size="2" color={caregiver.rejectionRate > 5 ? "red" : caregiver.rejectionRate > 3 ? "orange" : "green"}>
                              {caregiver.rejectionRate}%
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </div>

                    {/* 자기소개 */}
                    <Text size="2" color="gray" className="leading-relaxed">
                      &ldquo;{caregiver.selfIntroduction}&rdquo;
                    </Text>
                  </Flex>
                </RadioCards.Item>
              ))}
            </RadioCards.Root>
          ) : (
            <Card className="p-8 text-center">
              <Flex direction="column" gap="3" align="center">
                <Text size="3" weight="medium" color="gray">
                  현재 조건에 맞는 보호사가 없습니다.
                </Text>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/main')}
                >
                  홈으로 돌아가기
                </Button>
              </Flex>
            </Card>
          )}
        </div>


      </Flex>

      {/* 플로팅 확정 버튼 */}
      {selectedCaregiverId && (
        <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              <Flex align="center" justify="between" className="mb-3">
                <Flex align="center" gap="2">
                  <Text size="2" weight="medium">선택된 요양보호사</Text>
                </Flex>
                <Badge color="green">선택됨</Badge>
              </Flex>
              <Flex justify="between" align="center" className="mb-4">
                <Flex align="center" gap="2">
                  <Text size="3" weight="medium">
                    {caregivers.find(c => c.id === selectedCaregiverId)?.name}
                  </Text>
                  <Text size="2" color="gray">
                    {caregivers.find(c => c.id === selectedCaregiverId)?.gender === 'female' ? '여' : '남'} / {' '}
                    {caregivers.find(c => c.id === selectedCaregiverId)?.age}세 / {' '}
                    경력 {caregivers.find(c => c.id === selectedCaregiverId)?.experience}년
                  </Text>
                </Flex>
                <Flex align="center" gap="2">
                  {renderStars(caregivers.find(c => c.id === selectedCaregiverId)?.rating || 0)}
                  <Text size="2" color="gray">
                    {caregivers.find(c => c.id === selectedCaregiverId)?.rating}
                  </Text>
                </Flex>
              </Flex>
              <Flex gap="3">
                <Button 
                  variant="outline"
                  className="flex-1" 
                  size="3"
                  onClick={() => {
                    // TODO: 리뷰 보기 다이얼로그 열기
                    console.log('리뷰 보기:', selectedCaregiverId);
                  }}
                >
                  리뷰 보기
                </Button>
                <Button 
                  className="flex-1" 
                  size="3"
                  onClick={handleConfirmSelection}
                >
                  신청 확정하기
                </Button>
              </Flex>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 카드 공간 확보 */}
      {selectedCaregiverId && <div className="h-36"></div>}

      {/* 요청 날짜 캘린더 다이얼로그 */}
      <Dialog.Root open={isDateCalendarDialogOpen} onOpenChange={setIsDateCalendarDialogOpen}>
        <Dialog.Content>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Dialog.Title className="flex items-center">요청 날짜 상세보기</Dialog.Title>
              <Button
                variant="ghost"
                size="2"
                onClick={() => setIsDateCalendarDialogOpen(false)}
                className="flex items-center gap-1 self-center -mt-4"
              >
                <X size={16} />
                <Text size="2" weight="medium">닫기</Text>
              </Button>
            </Flex>
            
            {/* 캘린더 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              {/* 년월 표시 */}
              <div className="flex items-center justify-center gap-8 mb-4">
                <Button 
                  variant="ghost" 
                  size="3"
                  onClick={() => {
                    setCurrentMonth(prev => {
                      const newMonth = new Date(prev);
                      newMonth.setMonth(prev.getMonth() - 1);
                      return newMonth;
                    });
                  }}
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
                  onClick={() => {
                    setCurrentMonth(prev => {
                      const newMonth = new Date(prev);
                      newMonth.setMonth(prev.getMonth() + 1);
                      return newMonth;
                    });
                  }}
                  className="p-3"
                >
                  <ChevronRightIcon width={20} height={20} />
                </Button>
              </div>

              {/* 캘린더 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="text-center py-2">
                    <Text size="1" weight="medium">{day}</Text>
                  </div>
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
                  const dateString = (() => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                  })();
                  
                  // 범위 선택을 위한 스타일링 (신청서와 동일한 로직)
                  const sortedDates = [...applicationData.requestedDates].sort();
                  const startDate = sortedDates[0];
                  const endDate = sortedDates[sortedDates.length - 1];
                  const isStart = startDate === dateString;
                  const isEnd = endDate === dateString;
                  const isInRange = startDate && endDate && 
                    dateString >= startDate && dateString <= endDate;
                  const isSelected = applicationData.requestedDates.includes(dateString);
                  
                  let cellClass = '';
                  let cellStyle = {};

                  if (!isCurrentMonth || isPast) {
                    cellClass = 'text-gray-300';
                  } else if (isStart || isEnd) {
                    // 시작일/종료일 - 진한 색
                    cellClass = 'text-white';
                    cellStyle = { backgroundColor: 'var(--accent-9)' };
                  } else if (isInRange && isSelected) {
                    // 중간 날짜 - 연한 녹색
                    cellClass = 'text-accent-11';
                    cellStyle = { backgroundColor: 'var(--accent-4)' };
                  } else {
                    cellClass = 'text-gray-700';
                  }

                  return (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-lg ${cellClass}`}
                      style={cellStyle}
                    >
                      <Text 
                        size="2" 
                        weight={isToday ? "bold" : "medium"}
                        className={isToday && !isStart && !isEnd && !isInRange ? "underline" : ""}
                        style={isToday && !isPast && !isStart && !isEnd && !isInRange ? { color: 'var(--accent-9)' } : {}}
                      >
                        {date.getDate()}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </div>

            <Flex gap="3" className="mt-4">
              <Button 
                onClick={() => setIsDateCalendarDialogOpen(false)}
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
