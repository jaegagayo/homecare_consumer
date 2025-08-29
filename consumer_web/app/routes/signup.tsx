import { useState, useEffect } from "react";
import { useNavigate, Link } from "@remix-run/react";
import { 
  Button, 
  Flex, 
  Heading, 
  Text, 
  TextField,
  Callout
} from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";


export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: ""
  });
  
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 유형 가져오기
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    } else {
      // 사용자 유형이 없으면 가입 유형 선택 페이지로 리다이렉트
      navigate("/signup-type");
    }
  }, [navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      // 더미 회원가입 - 실제 API 호출로 대체 필요
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 회원가입 정보를 localStorage에 저장 (프로필 설정에서 사용)
      localStorage.setItem("signup_name", formData.name);
      localStorage.setItem("signup_phone", formData.phone);
      localStorage.setItem("signup_email", formData.email);
      
      // 회원가입 성공 시 프로필 설정 페이지로 이동
      navigate("/signup-profile");
    } catch (err) {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-1 to-accent-2 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <Flex align="center" gap="3">
          <Button variant="ghost" size="2" onClick={handleGoBack}>
            <ArrowLeft size={16} />
          </Button>
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
                  회원가입
                </Heading>
                <Text size="3" color="gray" className="text-center">
                  재가가요 계정을 만들어보세요
                </Text>
              </Flex>

              <form onSubmit={handleSubmit} className="w-full">
                <Flex direction="column" gap="4" className="w-full">
                  {error && (
                    <Callout.Root color="red">
                      <Callout.Text>{error}</Callout.Text>
                    </Callout.Root>
                  )}

                  <Flex direction="column" gap="3">
                    <Text size="2" weight="medium">
                      {userType === "guardian" ? "보호자 이름" : "이름"} *
                    </Text>
                    <TextField.Root
                      placeholder={userType === "guardian" ? "보호자 이름을 입력하세요" : "이름을 입력하세요"}
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      size="3"
                    />
                  </Flex>

                  <Flex direction="column" gap="3">
                    <Text size="2" weight="medium">이메일 *</Text>
                    <TextField.Root
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      size="3"
                    />
                  </Flex>

                  <Flex direction="column" gap="3">
                    <Text size="2" weight="medium">비밀번호 *</Text>
                    <TextField.Root
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                      size="3"
                    />
                  </Flex>

                  <Flex direction="column" gap="3">
                    <Text size="2" weight="medium">비밀번호 확인 *</Text>
                    <TextField.Root
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      required
                      size="3"
                    />
                  </Flex>

                  <Flex direction="column" gap="3">
                    <Text size="2" weight="medium">
                      {userType === "guardian" ? "보호자 전화번호" : "전화번호"} *
                    </Text>
                    <TextField.Root
                      type="tel"
                      placeholder={userType === "guardian" ? "보호자 전화번호를 입력하세요" : "전화번호를 입력하세요"}
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
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
                    {isLoading ? "가입 중..." : "회원가입"}
                  </Button>
                </Flex>
              </form>

              <Flex direction="column" align="center" gap="2">
                <Text size="2" color="gray">
                  이미 계정이 있으신가요?{" "}
                  <Link to="/login" className="text-accent-11 hover:underline">
                    로그인
                  </Link>
                </Text>
              </Flex>
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
}
