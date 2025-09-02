import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Heading
} from "@radix-ui/themes";
import { 
  CaregiverList, 
  SelectedCaregiverInfo
} from "../components/Matching";
import {
  type Caregiver,
  type ServiceRequest
} from "../types/matching";
import { type ApplicationForm } from "../types/application";
import { getMatchingCandidates } from "../api/matching";

export default function MatchingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // 신청서에서 전달받은 데이터 또는 기본 모킹 데이터
  const [applicationData] = useState<ApplicationForm>(() => {
    const state = location.state as { applicationData?: ApplicationForm; fromApplication?: boolean; requestId?: string };
    
    if (state?.applicationData && state?.fromApplication) {
      // 신청서에서 전달받은 데이터 사용
      return state.applicationData;
    }
    
    // 기본 모킹 데이터 (신청서 타입에 맞게 수정)
    return {
      serviceType: 'VISITING_CARE',
      serviceAddress: '서울시 강남구 역삼동 123-45',
      addressType: 'ROAD',
      location: {
        latitude: 37.5665,
        longitude: 126.9780
      },
      requestDate: '2025-01-15',
      preferredStartTime: '09:00',
      preferredEndTime: '11:00',
      duration: 120, // 2시간 (분 단위)
      additionalInformation: '계단이 있는 3층입니다. 보행기 사용이 필요합니다.'
    };
  });

  // serviceRequestId 가져오기 (URL 파라미터 우선, 없으면 state에서)
  const getServiceRequestId = () => {
    // 1. URL 파라미터에서 먼저 확인
    const urlRequestId = searchParams.get('requestId');
    if (urlRequestId) {
      return urlRequestId;
    }
    
    // 2. location.state에서 확인
    const state = location.state as { requestId?: string };
    return state?.requestId;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const serviceRequestId = getServiceRequestId();
        
        if (serviceRequestId) {
          // 실제 API 호출
          const candidates = await getMatchingCandidates(serviceRequestId);
          setCaregivers(candidates);
        } else {
          // serviceRequestId가 없는 경우 에러 처리
          setError('서비스 요청 ID를 찾을 수 없습니다.');
          setCaregivers([]);
        }

        // 서비스 요청 데이터 생성
        const serviceRequest: ServiceRequest = {
          id: "application-request",
          serviceType: applicationData.serviceType,
          date: applicationData.requestDate ? 
            (() => {
              const date = new Date(applicationData.requestDate);
              return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
            })() : '미정',
          time: `${applicationData.preferredStartTime}부터 ${applicationData.duration >= 60 ? 
            `${Math.floor(applicationData.duration / 60)}시간${applicationData.duration % 60 > 0 ? ` ${applicationData.duration % 60}분` : ''}` : 
            `${applicationData.duration}분`
          }`,
          address: applicationData.serviceAddress,
          specialRequests: applicationData.additionalInformation || '',
          status: 'pending'
        };

        setServiceRequests([serviceRequest]);
      } catch (error) {
        console.error('Failed to load matching candidates:', error);
        setError('후보 목록을 불러오는데 실패했습니다.');
        setCaregivers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [applicationData]);

  const handleConfirmSelection = () => {
    if (!selectedCaregiverId) {
      alert('보호사를 선택해주세요.');
      return;
    }
    
    // 선택된 보호사 정보
    const selectedCaregiver = caregivers.find(c => c.caregiverId === selectedCaregiverId);
    if (!selectedCaregiver) {
      alert('선택된 보호사 정보를 찾을 수 없습니다.');
      return;
    }
    
    // 서비스 요청 정보
    const currentServiceRequest = serviceRequests.find(r => r.id === "application-request");
    if (!currentServiceRequest) {
      alert('서비스 요청 정보를 찾을 수 없습니다.');
      return;
    }
    
    // 확정된 데이터 준비
    const confirmedData = {
      caregiver: selectedCaregiver,
      serviceRequest: currentServiceRequest
    };
    
    // 확정 안내 페이지로 이동
    navigate('/main/confirmation', { 
      state: { confirmedData } 
    });
  };

  if (isLoading) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text>후보 목록을 불러오는 중...</Text>
      </Flex>
    </Container>
  );
}

if (error) {
  return (
    <Container size="2" className="p-4">
      <Flex direction="column" align="center" gap="4" className="py-8">
        <Text color="red" size="4">{error}</Text>
        <Text size="3" color="gray">잠시 후 다시 시도해주세요.</Text>
      </Flex>
    </Container>
  );
}

if (caregivers.length === 0) {
  return (
    <Container size="2" className="p-4">
      <Flex direction="column" align="center" gap="4" className="py-8">
        <Text size="4" color="gray">조건에 맞는 요양보호사가 없습니다.</Text>
        <Text size="3" color="gray">다른 조건으로 다시 검색해보세요.</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="4">
        {/* 헤더 */}
        <div>
          <Heading size="5">요양보호사 후보</Heading>
          <Text size="3" color="gray">
            서비스 요청에 맞는 요양보호사를 선택하세요
          </Text>
        </div>

        {/* 요양보호사 목록 */}
        <CaregiverList
          caregivers={caregivers}
          selectedCaregiverId={selectedCaregiverId}
          onCaregiverSelect={setSelectedCaregiverId}
        />

        {/* 선택된 요양보호사 정보 */}
        <SelectedCaregiverInfo
          selectedCaregiver={caregivers.find(c => c.caregiverId === selectedCaregiverId) || null}
          onConfirm={handleConfirmSelection}
        />
      </Flex>
      
      {/* 플로팅 버튼이 있을 때 하단 여백 */}
      {selectedCaregiverId && <div className="h-36"></div>}
    </Container>
  );
}
