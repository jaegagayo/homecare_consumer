import { useNavigate } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Heading,
  Card
} from "@radix-ui/themes";
import { 
  Users,
  MapPin
} from "lucide-react";

export default function ChangeOptionsPage() {
  const navigate = useNavigate();



  const handleProfileChange = () => {
    // TODO: 프로필 변경 페이지로 이동
    navigate('/main/profile');
  };

  const handleApplicationForm = () => {
    navigate('/main/application-form');
  };

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="4">

        {/* 헤더 */}
        <div>
          <Heading size="5">변경 옵션 선택</Heading>
          <Text size="3" color="gray">
            어떤 부분을 변경하고 싶으신가요?
          </Text>
        </div>

        {/* 옵션 1: 다른 성향의 보호사 */}
        <button 
          className="w-full text-left cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded-lg border-0 bg-transparent"
          onClick={handleProfileChange}
        >
          <Flex direction="column" gap="4">
            <Flex align="center" gap="3">
              <div className="p-3 border border-[var(--accent-9)] rounded-lg">
                <Users size={24} className="text-[var(--accent-9)]" />
              </div>
              <Flex direction="column" className="flex-1">
                <Heading size="3">다른 성향의 보호사를 찾고 싶어요</Heading>
                <Text size="2" color="gray">
                  현재 매칭된 보호사와 다른 성향이나 전문성을 가진 보호사를 원하시는 경우
                </Text>
              </Flex>
            </Flex>
            
            <Card className="p-4 bg-blue-50">
              <Text size="2" weight="medium" className="mb-2 block">변경 가능한 항목</Text>
              <Flex direction="column" gap="1">
                <Text size="1" color="gray">• 보호사 성별, 연령대</Text>
                <Text size="1" color="gray">• 전문 분야 (치매 케어, 중증 케어 등)</Text>
                <Text size="1" color="gray">• 경력 및 자격증</Text>
                <Text size="1" color="gray">• 성격 및 돌봄 스타일</Text>
              </Flex>
            </Card>

            <Button variant="outline" className="w-full">
              프로필 변경하기
            </Button>
          </Flex>
        </button>

        {/* 구분선 */}
        <div className="border-t border-gray-200"></div>

        {/* 옵션 2: 다른 시간/장소 */}
        <button 
          className="w-full text-left cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded-lg border-0 bg-transparent"
          onClick={handleApplicationForm}
        >
          <Flex direction="column" gap="4">
            <Flex align="center" gap="3">
              <div className="p-3 border border-[var(--accent-9)] rounded-lg">
                <MapPin size={24} className="text-[var(--accent-9)]" />
              </div>
              <Flex direction="column" className="flex-1">
                <Heading size="3">다른 시간/다른 곳에서 돌봄 받기 원해요</Heading>
                <Text size="2" color="gray">
                  서비스 시간, 장소, 유형 등을 변경하고 싶으신 경우
                </Text>
              </Flex>
            </Flex>
            
            <Card className="p-4 bg-green-50">
              <Text size="2" weight="medium" className="mb-2 block">변경 가능한 항목</Text>
              <Flex direction="column" gap="1">
                <Text size="1" color="gray">• 서비스 날짜 및 시간</Text>
                <Text size="1" color="gray">• 서비스 장소 (주소)</Text>
                <Text size="1" color="gray">• 서비스 유형 (방문요양, 방문목욕 등)</Text>
                <Text size="1" color="gray">• 특별 요청사항</Text>
              </Flex>
            </Card>

            <Button variant="outline" className="w-full">
              신청서 다시 작성하기
            </Button>
          </Flex>
        </button>

      </Flex>
    </Container>
  );
}
