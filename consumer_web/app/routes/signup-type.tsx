import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Button, 
  Flex, 
  Heading, 
  Text, 
  RadioCards,
  Box
} from "@radix-ui/themes";
import { User, Users, ArrowLeft } from "lucide-react";

export default function SignupType() {
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleContinue = () => {
    if (selectedType) {
      localStorage.setItem("userType", selectedType);
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-1 to-accent-2 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <Flex align="center" gap="3">
          <button 
            onClick={handleGoBack}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} className="text-gray-600" />
          </button>
          <Text size="3" weight="medium">재가가요</Text>
        </Flex>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 py-8">
        <div className="w-full max-w-md mx-auto">
          <div className="p-8">
            <Flex direction="column" align="center" gap="6">
              <Flex direction="column" align="center" gap="4">
                <Heading size="6" className="text-center">
                  가입 유형 선택
                </Heading>
                <Text size="3" color="gray" className="text-center">
                  가입의 편의를 목적으로 하며,<br />
                  입력 내용에 대한 차이는 없습니다.
                </Text>
              </Flex>

              <Box className="w-full">
                <RadioCards.Root 
                  value={selectedType} 
                  onValueChange={handleTypeChange}
                  columns='1'
                >
                  <RadioCards.Item value="self">
                    <Flex direction="column" width="100%" gap="4">
                      <Flex align="center" gap="3">
                        <div className="p-3 bg-accent-3 rounded-lg">
                          <User size={24} className="text-accent-11" />
                        </div>
                        <Flex direction="column" className="flex-1">
                          <Text weight="bold" size="3">본인 가입</Text>
                          <Text size="2" color="gray">
                            돌봄을 받는 본인이 직접 가입
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </RadioCards.Item>

                  <RadioCards.Item value="guardian">
                    <Flex direction="column" width="100%" gap="4">
                      <Flex align="center" gap="3">
                        <div className="p-3 bg-accent-3 rounded-lg">
                          <Users size={24} className="text-accent-11" />
                        </div>
                        <Flex direction="column" className="flex-1">
                          <Text weight="bold" size="3">보호자 가입</Text>
                          <Text size="2" color="gray">
                            보호자가 돌봄 대상자를 대신해 가입
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
              </Box>

              <Button 
                size="3" 
                onClick={handleContinue}
                disabled={!selectedType}
                className="w-full"
              >
                계속하기
              </Button>
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
}
