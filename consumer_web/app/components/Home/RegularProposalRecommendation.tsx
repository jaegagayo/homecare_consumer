import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Flex,
  Text,
  Heading,
  Button
} from "@radix-ui/themes";
import { Star, Calendar, Clock, CalendarDays, ChevronLeft, ChevronRight, User } from "lucide-react";
import { RecommendRecurringOfferResponse } from "../../types";
import { getDayOfWeekKorean } from "../../utils";

// 백엔드 API 응답 타입을 사용
type RegularProposalRecommendation = RecommendRecurringOfferResponse;

interface RegularProposalRecommendationProps {
  recommendations: RegularProposalRecommendation[];
}

export default function RegularProposalRecommendation({ recommendations }: RegularProposalRecommendationProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // HH:MM:SS 형식에서 HH:MM 형식으로 변환
    return timeString.substring(0, 5);
  };

  const handleApply = (recommendation: RegularProposalRecommendation) => {
    navigate(`/main/regular-service-proposal?serviceMatchId=${recommendation.serviceMatchId}&from=recommendation`);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : recommendations.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < recommendations.length - 1 ? prev + 1 : 0);
  };

  return (
    <div>
      <Flex align="center" justify="between" className="mb-4">
        <Heading size="4">정기 제안 추천</Heading>
        {recommendations.length > 1 && (
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
              {currentIndex + 1} / {recommendations.length}
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
      {recommendations && recommendations.length > 0 ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <Flex direction="column" gap="4">
            {/* 안내 문구 */}
            <Flex align="center" gap="2">
              <Star size={20} className="text-yellow-500" />
              <Text size="3" color="gray">
                정기 방문을 제안드려요
              </Text>
            </Flex>

            {/* 제안 요약 (요양보호사/요일/시간대/날짜) */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <Flex align="center" gap="2">
                <User size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{recommendations[currentIndex].caregiverName} 요양보호사</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Calendar size={16} className="text-gray-500" />
                <Text size="3" weight="medium">
                  {recommendations[currentIndex].dayOfWeek.map(day => getDayOfWeekKorean(day)).join(', ')}
                </Text>
              </Flex>
              <Flex align="center" gap="2">
                <Clock size={16} className="text-gray-500" />
                <Text size="3" weight="medium">
                  {formatTime(recommendations[currentIndex].serviceStartTime)} - {formatTime(recommendations[currentIndex].serviceEndTime)}
                </Text>
              </Flex>
              <Flex align="center" gap="2">
                <CalendarDays size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{recommendations[currentIndex].serviceDate}</Text>
              </Flex>
            </div>

            {/* 신청하기 CTA 버튼 */}
            <Button
              className="w-full"
              onClick={() => handleApply(recommendations[currentIndex])}
            >
              정기 제안 신청하기
            </Button>
          </Flex>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <Text size="3" color="gray">맞춤형 정기 서비스 추천이 없습니다</Text>
        </div>
      )}
    </div>
  );
}
