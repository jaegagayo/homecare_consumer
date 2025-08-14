import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Button, Card, Container, Flex, Heading, Text } from "@radix-ui/themes";

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
    navigate("/signup");
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
    <Container size="2" className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <Flex direction="column" align="center" gap="6">
          <Flex direction="column" align="center" gap="4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 text-blue-600">🏠</div>
            </div>
            <Heading size="6" className="text-center">
              재가가요
            </Heading>
            <Text size="3" color="gray" className="text-center">
              소비자 전용 앱에 로그인하세요
            </Text>
          </Flex>

          <Flex direction="column" gap="3" className="w-full">
            <Button size="3" onClick={handleLogin} className="w-full">
              로그인
            </Button>
            <Button 
              size="3" 
              variant="outline" 
              onClick={handleSignup}
              className="w-full"
            >
              회원가입
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Container>
  );
}
