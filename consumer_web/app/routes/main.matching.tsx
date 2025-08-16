import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Heading,
  Card,
  Badge,
  Dialog
} from "@radix-ui/themes";
import { 
  Calendar,
  Star,
  MapPin,
  Clock,
  X,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";

interface Caregiver {
  id: string;
  name: string;
  rating: number;
  experience: number;
  specialties: string[];
  location: string;
  hourlyRate: number;
  availableDays: string[];
  availableHours: string;
  profileImage: string;
  status: 'available' | 'busy' | 'offline';
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
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isDateCalendarDialogOpen, setIsDateCalendarDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // 모킹 신청서 데이터
  const [applicationData] = useState<ApplicationForm>({
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
  });

  // 모킹 바우처 정보 (신청서에 표시되는 정보)
  const [voucherInfo] = useState({
    selectedGrade: '3등급',
    voucherLimit: 1295400,
    currentUsage: 1200000,
    selfPayAmount: 194310,
    isMedicalBenefitRecipient: false
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
          name: "김케어",
          rating: 4.8,
          experience: 5,
          specialties: ["방문요양", "방문목욕"],
          location: "서울시 강남구",
          hourlyRate: 15000,
          availableDays: ["월", "화", "수", "목", "금"],
          availableHours: "09:00-18:00",
          profileImage: "",
          status: "available"
        },
        {
          id: "2",
          name: "박케어",
          rating: 4.6,
          experience: 3,
          specialties: ["방문요양", "주야간보호"],
          location: "서울시 서초구",
          hourlyRate: 14000,
          availableDays: ["월", "화", "수", "목", "금", "토"],
          availableHours: "08:00-20:00",
          profileImage: "",
          status: "available"
        },
        {
          id: "3",
          name: "이케어",
          rating: 4.9,
          experience: 7,
          specialties: ["방문요양", "방문간호"],
          location: "서울시 마포구",
          hourlyRate: 16000,
          availableDays: ["월", "화", "수", "목", "금"],
          availableHours: "10:00-16:00",
          profileImage: "",
          status: "busy"
        }
      ]);

      setServiceRequests([
        {
          id: "1",
          serviceType: "방문요양",
          date: "2024-08-15",
          time: "09:00-11:00",
          address: "서울시 강남구 역삼동",
          specialRequests: "계단이 있는 3층입니다. 보행기 사용이 필요합니다.",
          status: "pending"
        },
        {
          id: "2",
          serviceType: "방문목욕",
          date: "2024-08-16",
          time: "14:00-16:00",
          address: "서울시 서초구 서초동",
          specialRequests: "화장실이 복도 끝에 있습니다.",
          status: "matched",
          matchedCaregiver: {
            id: "1",
            name: "김케어",
            rating: 4.8,
            experience: 5,
            specialties: ["방문요양", "방문목욕"],
            location: "서울시 강남구",
            hourlyRate: 15000,
            availableDays: ["월", "화", "수", "목", "금"],
            availableHours: "09:00-18:00",
            profileImage: "",
            status: "available"
          }
        }
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string): "green" | "yellow" | "red" | "gray" => {
    switch (status) {
      case 'available': return 'green';
      case 'busy': return 'yellow';
      case 'offline': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return '가능';
      case 'busy': return '바쁨';
      case 'offline': return '오프라인';
      default: return '알 수 없음';
    }
  };

  const getRequestStatusColor = (status: string): "blue" | "green" | "yellow" | "gray" => {
    switch (status) {
      case 'pending': return 'blue';
      case 'matched': return 'yellow';
      case 'confirmed': return 'green';
      case 'completed': return 'gray';
      default: return 'gray';
    }
  };

  const getRequestStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '매칭 대기';
      case 'matched': return '매칭 완료';
      case 'confirmed': return '확정됨';
      case 'completed': return '완료';
      default: return '알 수 없음';
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

  const handleSelectCaregiver = async (requestId: string, caregiverId: string) => {
    // TODO: 실제 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setServiceRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'matched', matchedCaregiver: caregivers.find(c => c.id === caregiverId) }
          : request
      )
    );
    
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

        {/* 서비스 요청 목록 */}
        <div>
          <Flex justify="between" align="center" className="mb-4">
            <Heading size="4">서비스 요청</Heading>
            <Button 
              size="2" 
              variant="outline"
              onClick={() => setIsApplicationDialogOpen(true)}
            >
              신청서 조회/변경
            </Button>
          </Flex>
          <Flex direction="column" gap="3">
            {serviceRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="start">
                    <Flex direction="column" gap="2" className="flex-1">
                      <Flex align="center" gap="2">
                        <Calendar size={16} className="text-gray-500" />
                        <Text size="2" weight="medium">
                          {request.date} {request.time}
                        </Text>
                        <Badge color={getRequestStatusColor(request.status)}>
                          {getRequestStatusText(request.status)}
                        </Badge>
                      </Flex>
                      <Text size="3" weight="medium">
                        {request.serviceType}
                      </Text>
                      <Flex align="center" gap="2">
                        <MapPin size={16} className="text-gray-500" />
                        <Text size="2" color="gray">
                          {request.address}
                        </Text>
                      </Flex>
                      {request.specialRequests && (
                        <Text size="2" color="gray" className="bg-gray-50 p-2 rounded">
                          {request.specialRequests}
                        </Text>
                      )}
                    </Flex>
                  </Flex>

                  {/* 매칭된 요양보호사 정보 */}
                  {request.matchedCaregiver && (
                    <div className="border-t border-gray-200 pt-3">
                      <Text size="2" weight="medium" className="mb-2 block">매칭된 요양보호사</Text>
                      <Card className="p-3 bg-blue-50">
                        <Flex justify="between" align="center">
                          <Flex direction="column" gap="1">
                            <Text size="2" weight="medium">
                              {request.matchedCaregiver.name}
                            </Text>
                            <Flex align="center" gap="2">
                              {renderStars(request.matchedCaregiver.rating)}
                              <Text size="1" color="gray">
                                {request.matchedCaregiver.rating}
                              </Text>
                            </Flex>
                            <Text size="1" color="gray">
                              {request.matchedCaregiver.experience}년 경력
                            </Text>
                          </Flex>
                          <Text size="2" weight="medium">
                            {request.matchedCaregiver.hourlyRate.toLocaleString()}원/시간
                          </Text>
                        </Flex>
                      </Card>
                    </div>
                  )}

                  {/* 매칭 대기 중인 경우 요양보호사 선택 */}
                  {request.status === 'pending' && (
                    <div className="border-t border-gray-200 pt-3">
                      <Text size="2" weight="medium" className="mb-2 block">요양보호사 선택</Text>
                      <Flex direction="column" gap="2">
                        {caregivers.filter(c => c.status === 'available').map((caregiver) => (
                          <Card key={caregiver.id} className="p-3">
                            <Flex justify="between" align="center">
                              <Flex direction="column" gap="1" className="flex-1">
                                <Text size="2" weight="medium">
                                  {caregiver.name}
                                </Text>
                                <Flex align="center" gap="2">
                                  {renderStars(caregiver.rating)}
                                  <Text size="1" color="gray">
                                    {caregiver.rating}
                                  </Text>
                                </Flex>
                                <Text size="1" color="gray">
                                  {caregiver.experience}년 경력 • {caregiver.specialties.join(', ')}
                                </Text>
                                <Text size="1" color="gray">
                                  {caregiver.location} • {caregiver.availableHours}
                                </Text>
                              </Flex>
                              <Flex direction="column" align="end" gap="2">
                                <Text size="2" weight="medium">
                                  {caregiver.hourlyRate.toLocaleString()}원/시간
                                </Text>
                                <Button 
                                  size="1" 
                                  onClick={() => handleSelectCaregiver(request.id, caregiver.id)}
                                >
                                  선택
                                </Button>
                              </Flex>
                            </Flex>
                          </Card>
                        ))}
                      </Flex>
                    </div>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        </div>

        {/* 요양보호사 목록 */}
        <div>
          <Heading size="4" className="mb-4">사용 가능한 요양보호사</Heading>
          <Flex direction="column" gap="3">
            {caregivers.map((caregiver) => (
              <Card key={caregiver.id} className="p-4">
                <Flex justify="between" align="center">
                  <Flex direction="column" gap="2" className="flex-1">
                    <Flex align="center" gap="2">
                      <Text size="3" weight="medium">
                        {caregiver.name}
                      </Text>
                      <Badge color={getStatusColor(caregiver.status)}>
                        {getStatusText(caregiver.status)}
                      </Badge>
                    </Flex>
                    <Flex align="center" gap="2">
                      {renderStars(caregiver.rating)}
                      <Text size="1" color="gray">
                        {caregiver.rating} ({caregiver.experience}년 경력)
                      </Text>
                    </Flex>
                    <Text size="2" color="gray">
                      {caregiver.specialties.join(', ')}
                    </Text>
                    <Flex align="center" gap="2">
                      <MapPin size={16} className="text-gray-500" />
                      <Text size="2" color="gray">
                        {caregiver.location}
                      </Text>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Clock size={16} className="text-gray-500" />
                      <Text size="2" color="gray">
                        {caregiver.availableDays.join(', ')} {caregiver.availableHours}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction="column" align="end" gap="2">
                    <Text size="3" weight="bold">
                      {caregiver.hourlyRate.toLocaleString()}원/시간
                    </Text>
                    <Button 
                      size="2" 
                      variant="outline"
                      disabled={caregiver.status !== 'available'}
                    >
                      상세보기
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        </div>
      </Flex>

      {/* 신청서 조회/변경 다이얼로그 */}
      <Dialog.Root open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <Dialog.Content>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Dialog.Title className="flex items-center">신청서 조회</Dialog.Title>
              <Button
                variant="ghost"
                size="2"
                onClick={() => setIsApplicationDialogOpen(false)}
                className="flex items-center gap-1 self-center -mt-4"
              >
                <X size={16} />
                <Text size="2" weight="medium">닫기</Text>
              </Button>
            </Flex>
            
            <Dialog.Description>
              <Text size="2" color="gray">
                현재 신청서 내용을 확인하고 필요시 수정할 수 있습니다.
              </Text>
            </Dialog.Description>

            <Flex direction="column" gap="4">
              {/* 서비스 유형 섹션 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 유형</Text>
                  <Badge color="blue">
                    {applicationData.serviceType === 'visiting-care' ? '방문요양서비스' : 
                     applicationData.serviceType === 'day-night-care' ? '주야간보호서비스' :
                     applicationData.serviceType === 'respite-care' ? '단기보호서비스' :
                     applicationData.serviceType === 'visiting-bath' ? '방문목욕서비스' :
                     applicationData.serviceType === 'in-home-support' ? '재가노인지원서비스' :
                     applicationData.serviceType === 'visiting-nursing' ? '방문간호서비스' : applicationData.serviceType}
                  </Badge>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 주소 섹션 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">서비스 주소</Text>
                  <Text size="2">{applicationData.address}</Text>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 시간 정보 섹션 */}
              <div>
                <Flex justify="between" align="center" className="mb-2">
                  <Text size="2" weight="medium">서비스 시간</Text>
                  <Text size="2">{applicationData.preferredHours.start} ~ {applicationData.preferredHours.end}</Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">소요 시간</Text>
                  <Text size="2" color="gray">{applicationData.duration}시간</Text>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 요청 날짜 섹션 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">요청 날짜</Text>
                  <Button 
                    size="1" 
                    variant="outline"
                    onClick={() => setIsDateCalendarDialogOpen(true)}
                  >
                    자세히 보기
                  </Button>
                </Flex>
                <Text size="2" color="gray" className="mt-1">
                  {applicationData.requestedDates.length > 0 ? (
                    (() => {
                      const sortedDates = [...applicationData.requestedDates].sort();
                      const startDate = sortedDates[0];
                      const endDate = sortedDates[sortedDates.length - 1];
                      return `${startDate} ~ ${endDate} (${applicationData.requestedDates.length}일)`;
                    })()
                  ) : (
                    '선택된 날짜 없음'
                  )}
                </Text>
              </div>

              <div className="w-full h-px bg-gray-200"></div>



              {/* 특별 요청사항 섹션 */}
              {applicationData.specialRequests && (
                <>
                  <div>
                    <div><Text size="2" weight="medium" className="mb-3">특별 요청사항</Text></div>
                    <div><Text size="2" className="leading-relaxed whitespace-pre-line">{applicationData.specialRequests}</Text></div>
                  </div>
                  <div className="w-full h-px bg-gray-200"></div>
                </>
              )}

              {/* 예상 사용 금액 섹션 */}
              <div>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">예상 사용 금액</Text>
                  <Text size="3" weight="bold" style={{ color: 'var(--accent-9)' }}>
                    ₩{applicationData.estimatedUsage.toLocaleString()}
                  </Text>
                </Flex>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* 바우처 정보 섹션 */}
              <div>
                <Flex justify="between" align="center" className="mb-2">
                  <Text size="2" weight="medium">바우처 등급</Text>
                  <Text size="2">{voucherInfo.selectedGrade}</Text>
                </Flex>
                <Flex justify="between" align="center" className="mb-2">
                  <Text size="2" weight="medium">월 한도</Text>
                  <Text size="2" color="gray">₩{voucherInfo.voucherLimit.toLocaleString()}</Text>
                </Flex>
                <Flex justify="between" align="center" className="mb-2">
                  <Text size="2" weight="medium">현재 사용량</Text>
                  <Text size="2" color="gray">₩{voucherInfo.currentUsage.toLocaleString()}</Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" weight="medium">남은 금액</Text>
                  <Text 
                    size="2" 
                    weight="medium"
                    style={{ 
                      color: (voucherInfo.voucherLimit - voucherInfo.currentUsage - applicationData.estimatedUsage) < 0 ? 'var(--red-9)' : 
                              (voucherInfo.voucherLimit - voucherInfo.currentUsage - applicationData.estimatedUsage) < 100000 ? 'var(--orange-9)' : 'var(--green-9)' 
                    }}
                  >
                    ₩{(voucherInfo.voucherLimit - voucherInfo.currentUsage - applicationData.estimatedUsage).toLocaleString()}
                  </Text>
                </Flex>
              </div>
            </Flex>

            <Flex gap="3" className="mt-4">
              <Button 
                variant="outline"
                onClick={() => setIsApplicationDialogOpen(false)}
                className="flex-1"
              >
                확인하기
              </Button>
              <Button 
                onClick={() => {
                  setIsApplicationDialogOpen(false);
                  navigate('/main/change-options');
                }}
                className="flex-1"
              >
                변경하기
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

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
