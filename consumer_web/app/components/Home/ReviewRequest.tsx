import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Flex, 
  Text,
  Heading,
  Button
} from "@radix-ui/themes";
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { ScheduleWithoutReviewResponse, ServiceType } from "../../types";
import { getServiceTypeKorean } from "../../utils/koreanTranslations";

type ReviewRequest = ScheduleWithoutReviewResponse;

interface ReviewRequestProps {
  reviewRequests: ReviewRequest[];
}

export default function ReviewRequest({ reviewRequests }: ReviewRequestProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleWriteReview = (reviewRequest: ReviewRequest) => {
    navigate(`/main/review-write?serviceMatchId=${reviewRequest.serviceMatchId}&caregiverName=${reviewRequest.caregiverName}&serviceType=${reviewRequest.serviceType}&serviceDate=${reviewRequest.serviceDate}&serviceTime=${reviewRequest.serviceStartTime}-${reviewRequest.serviceEndTime}`);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : reviewRequests.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < reviewRequests.length - 1 ? prev + 1 : 0);
  };

  return (
    <div>
      <Flex align="center" justify="between" className="mb-4">
        <Heading size="4">리뷰 요청</Heading>
        {reviewRequests.length > 1 && (
          <Flex align="center" gap="4">
            <Button 
              variant="ghost" 
              size="3" 
              onClick={handlePrevious}
              className="p-2"
            >
              <ChevronLeft size={20} />
            </Button>
            <Text size="4" color="gray" className="tracking-widest">
              {currentIndex + 1} / {reviewRequests.length}
            </Text>
            <Button 
              variant="ghost" 
              size="3" 
              onClick={handleNext}
              className="p-2"
            >
              <ChevronRight size={20} />
            </Button>
          </Flex>
        )}
      </Flex>
      {reviewRequests && reviewRequests.length > 0 ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <Flex direction="column" gap="4">
            {/* 안내 문구 */}
            <Flex align="center" gap="2">
              <Text size="3" color="gray">
                서비스는 어떠셨나요? 다른 분들이 참고할 수 있도록 리뷰를 남겨주세요.
              </Text>
            </Flex>

            {/* 보호사 이름, 방문 일시 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <Flex align="center" gap="2">
                <User size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{reviewRequests[currentIndex].caregiverName} 요양보호사</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Calendar size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{reviewRequests[currentIndex].serviceDate}</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Clock size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{reviewRequests[currentIndex].serviceStartTime} - {reviewRequests[currentIndex].serviceEndTime}</Text>
              </Flex>
              <div className="pt-1">
                <Text size="2" color="gray" className="bg-gray-100 px-2 py-1 rounded inline-block">
                  {getServiceTypeKorean(reviewRequests[currentIndex].serviceType)}
                </Text>
              </div>
            </div>

            {/* 리뷰 작성 CTA 버튼 */}
            <Button 
              className="w-full"
              onClick={() => handleWriteReview(reviewRequests[currentIndex])}
            >
              리뷰 작성
            </Button>
          </Flex>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <Text size="3" color="gray">작성 가능한 리뷰가 없습니다</Text>
        </div>
      )}
    </div>
  );
}
