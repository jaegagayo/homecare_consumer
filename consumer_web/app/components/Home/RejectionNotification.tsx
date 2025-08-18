import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Flex, 
  Text,
  Heading,
  Button
} from "@radix-ui/themes";
import { XCircle, Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";

interface RejectedSchedule {
  id: string;
  date: string;
  time: string;
  caregiverName: string;
  serviceType: string;
  rejectionReason?: string;
}

interface RejectionNotificationProps {
  rejections: RejectedSchedule[];
}

export default function RejectionNotification({ rejections }: RejectionNotificationProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRematch = (rejection: RejectedSchedule) => {
    // 기존 신청 내역을 자동 입력된 신청서 작성 화면으로 이동
    navigate(`/main/application-form?rejectedId=${rejection.id}`);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : rejections.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < rejections.length - 1 ? prev + 1 : 0);
  };

  return (
    <div>
      <Flex align="center" justify="between" className="mb-4">
        <Heading size="4">거절 알림</Heading>
        {rejections.length > 1 && (
          <Flex align="center" gap="4">
            <Button 
              variant="ghost" 
              size="3" 
              onClick={handlePrevious}
              className="p-2"
            >
              <ChevronLeft />
            </Button>
            <Text size="4" color="gray" className="tracking-widest">
              {currentIndex + 1} / {rejections.length}
            </Text>
            <Button 
              variant="ghost" 
              size="3" 
              onClick={handleNext}
              className="p-2"
            >
              <ChevronRight />
            </Button>
          </Flex>
        )}
      </Flex>
      {rejections && rejections.length > 0 ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <Flex direction="column" gap="4">
            {/* 안내 문구 */}
            <Flex align="center" gap="2">
              <XCircle size={20} className="text-red-500" />
              <Text size="3" color="gray">
                거절된 일정이 있습니다. 재매칭이 필요합니다.
              </Text>
            </Flex>

            {/* 일정 요약 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <Flex align="center" gap="2">
                <Calendar size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{rejections[currentIndex].date}</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Clock size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{rejections[currentIndex].time}</Text>
              </Flex>
              <Flex align="center" gap="2">
                <User size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{rejections[currentIndex].caregiverName} 요양보호사</Text>
              </Flex>
              <div className="pt-1">
                <Text size="2" color="gray" className="bg-gray-100 px-2 py-1 rounded inline-block">
                  {rejections[currentIndex].serviceType}
                </Text>
              </div>
            </div>

            {/* CTA 버튼들 */}
            <Flex gap="3">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // 신청 취소 로직
                  console.log('신청 취소:', rejections[currentIndex].id);
                }}
              >
                신청 취소
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handleRematch(rejections[currentIndex])}
              >
                재매칭
              </Button>
            </Flex>
          </Flex>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <Text size="3" color="gray">거절된 서비스 신청이 없습니다</Text>
        </div>
      )}
    </div>
  );
}
