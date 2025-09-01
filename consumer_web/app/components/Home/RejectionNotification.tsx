import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Flex, 
  Text,
  Heading,
  Button
} from "@radix-ui/themes";
import { XCircle, Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { CancelledScheduleResponse } from "../../types";

interface RejectionNotificationProps {
  rejections: CancelledScheduleResponse[];
}

export default function RejectionNotification({ rejections }: RejectionNotificationProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRematch = (rejection: CancelledScheduleResponse) => {
    // 기존 신청 내역을 자동 입력된 신청서 작성 화면으로 이동
    navigate(`/main/application-form?rejectedId=${rejection.serviceMatchId}`);
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
        <Heading size="4">취소된 일정 알림</Heading>
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
                취소된 일정이 있습니다. 재매칭이 필요합니다.
              </Text>
            </Flex>

            {/* 일정 요약 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <Flex align="center" gap="2">
                <Calendar size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{rejections[currentIndex].serviceDate}</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Clock size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{rejections[currentIndex].startTime} - {rejections[currentIndex].endTime}</Text>
              </Flex>
              <Flex align="center" gap="2">
                <User size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{rejections[currentIndex].caregiverName} 요양보호사</Text>
              </Flex>
            </div>

            {/* 재매칭 CTA 버튼 */}
            <Button 
              className="w-full"
              onClick={() => handleRematch(rejections[currentIndex])}
            >
              재매칭 신청
            </Button>
          </Flex>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <Text size="3" color="gray">취소된 일정이 없습니다</Text>
        </div>
      )}
    </div>
  );
}
