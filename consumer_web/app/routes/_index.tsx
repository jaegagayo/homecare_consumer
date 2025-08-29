import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Button, Container, Flex, Heading, Text } from "@radix-ui/themes";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 인증 상태 확인
    const token = localStorage.getItem("consumer_token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup-type");
  };

  if (isLoading) {
    return (
      <Container size="2" className="min-h-screen flex items-center justify-center">
        <Text size="4">로딩 중...</Text>
      </Container>
    );
  }

  if (isAuthenticated) {
    // 인증된 사용자는 메인 앱으로 리다이렉트
    navigate("/main/home");
    return null;
  }

  return (
    <Container size="2" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-1 to-accent-2">
      <div className="w-full max-w-md p-8">
        <Flex direction="column" align="center" gap="6">
          <Flex direction="column" align="center" gap="4">
            <div className="w-20 h-20 bg-accent-3 rounded-full flex items-center justify-center shadow-lg">
              <img 
                src="/smart_care_match_logo.svg" 
                alt="재가가요 로고" 
                className="w-16 h-16"
              />
            </div>
            <Heading size="6" className="text-center">
              재가가요
            </Heading>
            <Text size="3" color="gray" className="text-center">
              편안한 재가 돌봄 서비스
            </Text>
          </Flex>

          <Flex direction="column" gap="4" className="w-full">
            <Button size="3" onClick={handleLogin} className="w-full">
              로그인
            </Button>
            
            <Flex align="center" gap="3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <Text size="2" color="gray">또는</Text>
              <div className="flex-1 h-px bg-gray-200"></div>
            </Flex>
            
            <Button 
              size="3" 
              variant="outline" 
              onClick={handleSignup}
              className="w-full"
            >
              회원가입
            </Button>
          </Flex>

          <Flex direction="column" align="center" gap="3" className="pt-4 border-t border-gray-100">
            <Text size="2" color="gray" className="text-center">
              안전한 서비스 • 24시간 지원
            </Text>
          </Flex>
        </Flex>
      </div>
    </Container>
  );
}
