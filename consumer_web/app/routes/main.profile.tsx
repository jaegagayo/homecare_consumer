import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Container, Flex, Heading, Text, Button, Separator
} from "@radix-ui/themes";
import {
  User, Settings, LogOut, Mail, Phone, MapPin, Calendar
} from "lucide-react";
import { CameraIcon } from "@radix-ui/react-icons";

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    licenseNumber: "",
    profileImage: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const email = localStorage.getItem("caregiver_email") || "";
    // 실제로는 API에서 사용자 정보를 가져와야 함
    setUserInfo({
      name: "김케어",
      email: email,
      phone: "010-1234-5678",
      address: "서울시 강남구",
      birthDate: "1990-01-01",
      licenseNumber: "2024-001234",
      profileImage: ""
    });
  }, []);



  const handleLogout = () => {
    localStorage.removeItem("consumer_token");
    localStorage.removeItem("caregiver_email");
    navigate("/");
  };

  const handleSettings = () => {
    // 설정 화면으로 이동 (향후 구현)
    console.log("설정 화면으로 이동");
  };

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 프로필 섹션 */}
        <Flex direction="column" align="center" gap="4" className="py-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
              {userInfo.profileImage ? (
                <img 
                  src={userInfo.profileImage} 
                  alt="프로필 사진" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, var(--accent-3) 0%, var(--accent-6) 100%)`
                  }}
                >
                  <User size={40} style={{ color: 'var(--accent-9)' }} />
                </div>
              )}
            </div>
            <button 
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors"
              style={{
                backgroundColor: 'var(--accent-9)',
                color: 'var(--accent-1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-10)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-9)';
              }}
            >
              <CameraIcon width="16" height="16" />
            </button>
          </div>
          <Flex direction="column" align="center" gap="1">
            <Heading size="5">{userInfo.name}</Heading>
            <Text size="2" color="gray">요양보호사</Text>
          </Flex>
        </Flex>

        {/* 사용자 정보 */}
        <Flex direction="column" gap="4" className="py-4">
          <Heading size="4">기본 정보</Heading>
          
          <Flex direction="column" gap="3">
            <Flex align="center" gap="3">
              <Mail size={16} className="text-gray-500" />
              <Text size="2">{userInfo.email}</Text>
            </Flex>
            
            <Flex align="center" gap="3">
              <Phone size={16} className="text-gray-500" />
              <Text size="2">{userInfo.phone}</Text>
            </Flex>
            
            <Flex align="center" gap="3">
              <MapPin size={16} className="text-gray-500" />
              <Text size="2">{userInfo.address}</Text>
            </Flex>
            
            <Flex align="center" gap="3">
              <Calendar size={16} className="text-gray-500" />
              <Text size="2">{userInfo.birthDate}</Text>
            </Flex>
          </Flex>
        </Flex>

        {/* 자격 정보 */}
        <Flex direction="column" gap="4" className="py-4">
          <Heading size="4">자격 정보</Heading>
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">요양보호사 자격번호</Text>
            <Text size="2" color="gray">{userInfo.licenseNumber}</Text>
          </Flex>
        </Flex>

        {/* 설정 및 로그아웃 */}
        <Flex direction="column" gap="3" className="py-4">
          <Button 
            variant="ghost" 
            size="3" 
            onClick={handleSettings}
            className="justify-start"
          >
            <Settings size={16} />
            <Text>설정</Text>
          </Button>
          
          <Separator />
          
          <Button 
            variant="ghost" 
            size="3" 
            onClick={handleLogout}
            className="justify-start text-red-600"
          >
            <LogOut size={16} />
            <Text>로그아웃</Text>
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}
