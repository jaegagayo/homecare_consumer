import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Heading,
  Card,
  Badge
} from "@radix-ui/themes";
import { 
  Calendar,
  Star,
  MapPin,
  Clock
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

export default function MatchingPage() {
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
              onClick={() => navigate('/main/change-options')}
            >
              조건 변경하기
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
    </Container>
  );
}
