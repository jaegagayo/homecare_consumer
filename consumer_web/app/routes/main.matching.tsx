import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
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

export default function MatchingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>('');
  
  // 신청서에서 전달받은 데이터 또는 기본 모킹 데이터
  const [applicationData] = useState<ApplicationForm>(() => {
    const state = location.state as { applicationData?: ApplicationForm; fromApplication?: boolean };
    
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

  useEffect(() => {
    // 더미 데이터 로드
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCaregivers([
        {
          id: '1',
          name: '김영희',
          gender: 'female',
          age: 45,
          experience: 8,
          rating: 4.8,
          koreanProficiency: 'native',
          specialCaseExperience: {
            dementia: true,
            bedridden: false
          },
          outingAvailable: true,
          rejectionRate: 2,
          selfIntroduction: '8년간 요양보호사로 일하며 다양한 케이스를 경험했습니다. 특히 치매 환자 케이어에 전문성을 가지고 있으며, 따뜻한 마음으로 환자와 가족을 돌보겠습니다.'
        },
        {
          id: '2',
          name: '박철수',
          gender: 'male',
          age: 52,
          experience: 12,
          rating: 4.9,
          koreanProficiency: 'native',
          specialCaseExperience: {
            dementia: true,
            bedridden: true
          },
          outingAvailable: true,
          rejectionRate: 1,
          selfIntroduction: '12년간 요양보호사로 일하며 치매, 장기침상 등 다양한 케이스를 경험했습니다. 체력이 좋아 무거운 환자도 안전하게 케이어할 수 있습니다.'
        },
        {
          id: '3',
          name: '이미영',
          gender: 'female',
          age: 38,
          experience: 5,
          rating: 4.6,
          koreanProficiency: 'advanced',
          specialCaseExperience: {
            dementia: false,
            bedridden: false
          },
          outingAvailable: false,
          rejectionRate: 4,
          selfIntroduction: '5년간 요양보호사로 일하며 기본적인 일상생활 지원에 특화되어 있습니다. 깔끔하고 정확한 케이어를 제공하겠습니다.'
        },
        {
          id: '4',
          name: '최민수',
          gender: 'male',
          age: 48,
          experience: 10,
          rating: 4.7,
          koreanProficiency: 'native',
          specialCaseExperience: {
            dementia: true,
            bedridden: false
          },
          outingAvailable: true,
          rejectionRate: 3,
          selfIntroduction: '10년간 요양보호사로 일하며 치매 환자 케이어에 전문성을 가지고 있습니다. 환자의 안전을 최우선으로 생각하며 케이어하겠습니다.'
        }
      ]);

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
      setIsLoading(false);
    };

    loadData();
  }, [applicationData]);

  const handleConfirmSelection = () => {
    if (!selectedCaregiverId) {
      alert('보호사를 선택해주세요.');
      return;
    }
    
    // 선택된 보호사 정보
    const selectedCaregiver = caregivers.find(c => c.id === selectedCaregiverId);
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
          <Text>로딩 중...</Text>
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
          selectedCaregiver={caregivers.find(c => c.id === selectedCaregiverId) || null}
          onConfirm={handleConfirmSelection}
        />
      </Flex>
      
      {/* 플로팅 버튼이 있을 때 하단 여백 */}
      {selectedCaregiverId && <div className="h-36"></div>}
    </Container>
  );
}
