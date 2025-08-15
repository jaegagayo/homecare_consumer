import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "@remix-run/react";
import { 
  Button, 
  Flex, 
  Text
} from "@radix-ui/themes";
import { 
  Home, 
  Calendar, 
  Users, 
  FileText,
  User,
  ArrowLeft,
  Plus
} from "lucide-react";

export default function MainLayout() {
  const [currentTab, setCurrentTab] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPageTitle, setCurrentPageTitle] = useState("홈");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 인증 상태 확인
    const token = localStorage.getItem("consumer_token");
    if (!token) {
      navigate("/");
      return;
    }
    setIsAuthenticated(true);

    // 현재 경로에 따라 탭 설정
    const path = location.pathname;
    if (path.includes("/main/home")) {
      setCurrentTab(0);
      setCurrentPageTitle("홈");
    } else if (path.includes("/main/schedule")) {
      setCurrentTab(1);
      setCurrentPageTitle("일정");
    } else if (path.includes("/main/application-form")) {
      setCurrentTab(2);
      setCurrentPageTitle("서비스 신청서");
    } else if (path.includes("/main/matching")) {
      setCurrentTab(3);
      setCurrentPageTitle("매칭");
    } else if (path.includes("/main/reviews")) {
      setCurrentTab(4);
      setCurrentPageTitle("리뷰");
    } else if (path.includes("/main/service-request")) {
      setCurrentPageTitle("서비스 요청");
    } else if (path.includes("/main/profile")) {
      setCurrentPageTitle("프로필");
    } else if (path.includes("/main/application-form")) {
      setCurrentPageTitle("서비스 신청서");
    } else if (path.includes("/main/change-options")) {
      setCurrentPageTitle("변경 옵션 선택");
    } else if (path.includes("/main/review-write")) {
      setCurrentPageTitle("리뷰 작성");
    } else if (path.includes("/main/regular-service-proposal")) {
      setCurrentPageTitle("정기 서비스 제안");
    } else if (path.includes("/main/blacklist-report")) {
      setCurrentPageTitle("블랙리스트 신고");
    }
  }, [navigate, location]);

  const handleProfile = () => {
    navigate("/main/profile");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const tabs = [
    { id: 0, label: "홈", icon: Home, path: "/main/home" },
    { id: 1, label: "일정", icon: Calendar, path: "/main/schedule" },
    { id: 2, label: "신청", icon: Plus, path: "/main/application-form" },
    { id: 3, label: "매칭", icon: Users, path: "/main/matching" },
    { id: 4, label: "리뷰", icon: FileText, path: "/main/reviews" },
  ];

  const handleTabChange = (tabId: number) => {
    setCurrentTab(tabId);
    navigate(tabs[tabId].path);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 고정 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50">
        <Flex justify="between" align="center">
          <Flex align="center" gap="3">
            <Button variant="ghost" size="2" onClick={handleGoBack}>
              <ArrowLeft size={16} />
            </Button>
            <Text size="4" weight="medium">{currentPageTitle}</Text>
          </Flex>
          <Button variant="ghost" size="2" onClick={handleProfile}>
            <User size={16} />
          </Button>
        </Flex>
      </div>

      {/* 메인 콘텐츠 - 헤더 높이만큼 패딩 추가 */}
      <div className="pt-16 pb-20">
        <Outlet />
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <Flex justify="between" className="px-8 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="2"
                className={`flex flex-col items-center gap-1 px-8 py-2 ${
                  isActive ? "text-accent" : "text-gray-500"
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon size={20} />
                <Text size="1" className={isActive ? "text-accent" : "text-gray-500"}>
                  {tab.label}
                </Text>
              </Button>
            );
          })}
        </Flex>
      </div>
    </div>
  );
}
