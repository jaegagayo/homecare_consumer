import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Button, 
  Flex, 
  Heading, 
  Text, 
  TextField,
  Callout,
  Select,
  RadioGroup,
  Checkbox
} from "@radix-ui/themes";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ProfileData {
  // 사용자 유형
  userType: string;
  
  // 기본 정보
  name: string;
  birthDate: string;
  gender: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  
  // 주소 정보
  residentialAddress: string;
  visitAddress: string;
  entryMethod: string;
  
  // 요양 정보
  careGrade: string;
  medicalBenefit: string;
  weight: string;
  
  // 건강 정보
  diseases: string[];
  cognitiveState: string;
  cohabitationStatus: string;
}

const STEPS = [
  {
    id: 1,
    title: "기본 정보",
    description: "돌봄 대상자의 기본 정보를 입력해주세요"
  },
  {
    id: 2,
    title: "주소 정보", 
    description: "돌봄 대상자의 주소 정보를 입력해주세요"
  },
  {
    id: 3,
    title: "요양 정보",
    description: "돌봄 대상자의 요양 관련 정보를 입력해주세요"
  },
  {
    id: 4,
    title: "건강 정보",
    description: "돌봄 대상자의 건강 상태를 입력해주세요"
  }
];

export default function SignupProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    userType: "self", // 기본값은 본인 가입
    name: "",
    birthDate: "",
    gender: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    residentialAddress: "",
    visitAddress: "",
    entryMethod: "",
    careGrade: "",
    medicalBenefit: "",
    weight: "",
    diseases: [],
    cognitiveState: "",
    cohabitationStatus: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 유형 가져오기
    const userType = localStorage.getItem("userType");
    if (userType) {
      setProfileData(prev => ({ ...prev, userType }));
      
      // 가입 유형에 따라 기본 정보 자동 채우기
      if (userType === "self") {
        // 본인 가입: 이름과 전화번호를 기본 정보에 채우기
        const name = localStorage.getItem("signup_name");
        const phone = localStorage.getItem("signup_phone");
        if (name) setProfileData(prev => ({ ...prev, name }));
        if (phone) setProfileData(prev => ({ ...prev, phone }));
      } else if (userType === "guardian") {
        // 보호자 가입: 보호자 정보를 긴급연락자에 채우기
        const guardianName = localStorage.getItem("signup_name");
        const guardianPhone = localStorage.getItem("signup_phone");
        if (guardianName) setProfileData(prev => ({ ...prev, emergencyContact: guardianName }));
        if (guardianPhone) setProfileData(prev => ({ ...prev, emergencyPhone: guardianPhone }));
      }
    }
  }, []);

  const handleChange = (field: string, value: string | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleDiseaseChange = (disease: string, checked: boolean) => {
    if (checked) {
      setProfileData(prev => ({
        ...prev,
        diseases: [...prev.diseases, disease]
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        diseases: prev.diseases.filter(d => d !== disease)
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      // 프로필 정보 저장 로직
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 회원가입 시 저장한 이메일 가져오기
      const email = localStorage.getItem("signup_email");
      
      // 자동 로그인 처리
      if (email) {
        // 로그인 토큰 생성 및 저장 (실제로는 서버에서 받아야 함)
        localStorage.setItem("consumer_token", "dummy_token");
        localStorage.setItem("consumer_email", email);
        
        // 회원가입 관련 임시 데이터 정리
        localStorage.removeItem("userType");
        localStorage.removeItem("signup_name");
        localStorage.removeItem("signup_phone");
        localStorage.removeItem("signup_email");
      }
      
      // 메인 홈으로 이동
      navigate("/main/home");
    } catch (err) {
      setError("프로필 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                {profileData.userType === "guardian" ? "돌봄 대상자 이름" : "이름"} *
              </Text>
              <TextField.Root
                placeholder={profileData.userType === "guardian" ? "돌봄 대상자 이름을 입력하세요" : "이름을 입력하세요"}
                value={profileData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                size="3"
              />
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">생년월일 *</Text>
              <TextField.Root
                type="date"
                value={profileData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                required
                size="3"
              />
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">성별 *</Text>
              <Select.Root 
                value={profileData.gender} 
                onValueChange={(value) => handleChange("gender", value)}
              >
                <Select.Trigger placeholder="성별을 선택하세요" />
                <Select.Content>
                  <Select.Item value="male">남성</Select.Item>
                  <Select.Item value="female">여성</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                {profileData.userType === "guardian" ? "돌봄 대상자 휴대전화" : "휴대전화"} *
              </Text>
              <TextField.Root
                type="tel"
                placeholder={profileData.userType === "guardian" ? "돌봄 대상자 휴대전화번호를 입력하세요" : "휴대전화번호를 입력하세요"}
                value={profileData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
                size="3"
              />
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">보호자 성명</Text>
              <TextField.Root
                placeholder="보호자 성명을 입력하세요"
                value={profileData.emergencyContact}
                onChange={(e) => handleChange("emergencyContact", e.target.value)}
                size="3"
              />
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">보호자 전화번호</Text>
              <TextField.Root
                type="tel"
                placeholder="보호자 전화번호를 입력하세요"
                value={profileData.emergencyPhone}
                onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                size="3"
              />
            </Flex>
          </Flex>
        );

      case 2:
        return (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">거주지 주소 *</Text>
              <TextField.Root
                placeholder="거주지 주소를 입력하세요"
                value={profileData.residentialAddress}
                onChange={(e) => handleChange("residentialAddress", e.target.value)}
                required
                size="3"
              />
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">방문지 주소 *</Text>
              <TextField.Root
                placeholder="방문지 주소를 입력하세요"
                value={profileData.visitAddress}
                onChange={(e) => handleChange("visitAddress", e.target.value)}
                required
                size="3"
              />
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">출입방법</Text>
              <TextField.Root
                placeholder="출입방법을 입력하세요 (예: 인터폰, 도어락 등)"
                value={profileData.entryMethod}
                onChange={(e) => handleChange("entryMethod", e.target.value)}
                size="3"
              />
            </Flex>
          </Flex>
        );

      case 3:
        return (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">장기요양 인정등급 *</Text>
              <Select.Root 
                value={profileData.careGrade} 
                onValueChange={(value) => handleChange("careGrade", value)}
              >
                <Select.Trigger placeholder="등급을 선택하세요" />
                <Select.Content>
                  <Select.Item value="1">1등급</Select.Item>
                  <Select.Item value="2">2등급</Select.Item>
                  <Select.Item value="3">3등급</Select.Item>
                  <Select.Item value="4">4등급</Select.Item>
                  <Select.Item value="5">5등급</Select.Item>
                  <Select.Item value="cognitive">인지저하등급</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">의료급여 수급자 여부 *</Text>
              <RadioGroup.Root 
                value={profileData.medicalBenefit} 
                onValueChange={(value) => handleChange("medicalBenefit", value)}
              >
                <Flex direction="column" gap="2">
                  <label className="flex items-center gap-2">
                    <RadioGroup.Item value="yes" />
                    <Text size="2">예</Text>
                  </label>
                  <label className="flex items-center gap-2">
                    <RadioGroup.Item value="no" />
                    <Text size="2">아니오</Text>
                  </label>
                </Flex>
              </RadioGroup.Root>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">몸무게 (kg)</Text>
              <TextField.Root
                type="number"
                placeholder="몸무게를 입력하세요"
                value={profileData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                size="3"
              />
            </Flex>
          </Flex>
        );

      case 4:
        return (
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">질병 (복수 선택 가능)</Text>
              <Flex direction="column" gap="2">
                <label className="flex items-center gap-2">
                  <Checkbox 
                    checked={profileData.diseases.includes("dementia")}
                    onCheckedChange={(checked) => handleDiseaseChange("dementia", checked as boolean)}
                  />
                  <Text size="2">치매</Text>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox 
                    checked={profileData.diseases.includes("bedridden")}
                    onCheckedChange={(checked) => handleDiseaseChange("bedridden", checked as boolean)}
                  />
                  <Text size="2">와상</Text>
                </label>
              </Flex>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">인지상태 *</Text>
              <Select.Root 
                value={profileData.cognitiveState} 
                onValueChange={(value) => handleChange("cognitiveState", value)}
              >
                <Select.Trigger placeholder="인지상태를 선택하세요" />
                <Select.Content>
                  <Select.Item value="normal">정상</Select.Item>
                  <Select.Item value="mild">경도 장애</Select.Item>
                  <Select.Item value="moderate">중등도 장애</Select.Item>
                  <Select.Item value="severe">중증 장애</Select.Item>
                  <Select.Item value="unknown">판단 불가</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">동거여부</Text>
              <TextField.Root
                placeholder="동거 상황을 입력하세요 (예: 혼자, 배우자와 동거 등)"
                value={profileData.cohabitationStatus}
                onChange={(e) => handleChange("cohabitationStatus", e.target.value)}
                size="3"
              />
            </Flex>
          </Flex>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-1 to-accent-2 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <Flex align="center" gap="3">
          <div className="w-8 h-8 bg-accent-3 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 text-accent-11">🏠</div>
          </div>
          <Text size="3" weight="medium">재가가요</Text>
        </Flex>
      </div>

      {/* 진행 단계 표시 */}
      <div className="bg-white/60 px-4 py-3">
        <Flex align="center" justify="between">
          <Text size="2" color="gray">
            {STEPS[currentStep - 1].title} ({currentStep}/{STEPS.length})
          </Text>
          <div className="flex gap-1">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full ${
                  index + 1 <= currentStep ? 'bg-accent-9' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </Flex>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 py-8">
        <div className="w-full max-w-md mx-auto">
          <div className="p-8">
            <Flex direction="column" align="center" gap="6">
              <Flex direction="column" align="center" gap="4">
                <Heading size="6" className="text-center">
                  {STEPS[currentStep - 1].title}
                </Heading>
                <Text size="3" color="gray" className="text-center">
                  {STEPS[currentStep - 1].description}
                </Text>
              </Flex>

              <div className="w-full">
                {error && (
                  <Callout.Root color="red" className="mb-4">
                    <Callout.Text>{error}</Callout.Text>
                  </Callout.Root>
                )}

                {renderStepContent()}

                <Flex gap="3" className="mt-8">
                  {currentStep > 1 && (
                    <Button 
                      variant="outline" 
                      size="3" 
                      onClick={handlePrev}
                      className="flex-1"
                    >
                      <ArrowLeft size={16} />
                      이전
                    </Button>
                  )}
                  
                  {currentStep < STEPS.length ? (
                    <Button 
                      size="3" 
                      onClick={handleNext}
                      className="flex-1"
                    >
                      다음
                      <ArrowRight size={16} />
                    </Button>
                  ) : (
                    <Button 
                      size="3" 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "저장 중..." : "프로필 완료"}
                    </Button>
                  )}
                </Flex>
              </div>
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
}
