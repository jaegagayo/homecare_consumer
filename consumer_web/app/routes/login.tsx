import { useState } from "react";
import { useNavigate, Link } from "@remix-run/react";
import { 
  Button, 
  Flex, 
  Heading, 
  Text, 
  TextField,
  Callout
} from "@radix-ui/themes";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 더미 로그인 - 실제 API 호출로 대체 필요
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 로그인 성공 시 토큰 저장
      localStorage.setItem("consumer_token", "dummy_token");
      localStorage.setItem("consumer_email", email);
      
      navigate("/main/home");
    } catch (err) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <Flex align="center" gap="3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 text-blue-600">🏠</div>
          </div>
          <Text size="4" weight="medium">재가가요 소비자</Text>
        </Flex>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          <Flex direction="column" align="center" gap="8">
            <Flex direction="column" align="center" gap="4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 text-blue-600">🏠</div>
              </div>
              <Heading size="6" className="text-center">
                로그인
              </Heading>
              <Text size="3" color="gray" className="text-center">
                재가가요 소비자 계정으로 로그인하세요
              </Text>
            </Flex>

            <form onSubmit={handleSubmit} className="w-full">
              <Flex direction="column" gap="5" className="w-full">
                {error && (
                  <Callout.Root color="red">
                    <Callout.Text>{error}</Callout.Text>
                  </Callout.Root>
                )}

                <Flex direction="column" gap="3">
                  <Text size="2" weight="medium">이메일</Text>
                  <TextField.Root
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    size="3"
                  />
                </Flex>

                <Flex direction="column" gap="3">
                  <Text size="2" weight="medium">비밀번호</Text>
                  <TextField.Root
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    size="3"
                  />
                </Flex>

                <Button 
                  type="submit" 
                  size="3" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </Flex>
            </form>

            <Flex direction="column" align="center" gap="2">
              <Text size="2" color="gray">
                계정이 없으신가요?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  회원가입
                </Link>
              </Text>
            </Flex>
          </Flex>
        </div>
      </div>
    </div>
  );
}
