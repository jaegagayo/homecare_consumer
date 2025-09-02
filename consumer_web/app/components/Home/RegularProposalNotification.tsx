import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Flex, 
  Text,
  Badge,
  Heading,
  Button
} from "@radix-ui/themes";
import { Info, CheckCircle, XCircle, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { UnreadRecurringOfferResponse } from "../../types";
import { getRecurringStatusKorean, getRecurringStatusColor } from "../../utils/koreanTranslations";

// 백엔드 API 응답 타입을 사용
type RegularProposal = UnreadRecurringOfferResponse;

interface RegularProposalNotificationProps {
  proposals: RegularProposal[];
}

export default function RegularProposalNotification({ proposals }: RegularProposalNotificationProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // HH:MM:SS 형식에서 HH:MM 형식으로 변환
    return timeString.substring(0, 5);
  };

  const getGuidanceText = (status: string) => {
    switch (status) {
      case 'PENDING': return '보호사가 일정을 확인하고 있어요.';
      case 'APPROVED': return '정기 일정이 확정되었어요.';
      case 'REJECTED': return '정기 일정 신청이 거절되었어요.';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return Info;
      case 'APPROVED': return CheckCircle;
      case 'REJECTED': return XCircle;
      default: return Info;
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-blue-500';
      case 'APPROVED': return 'text-green-500';
      case 'REJECTED': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const handleViewDetails = (proposal: RegularProposal) => {
    navigate(`/main/schedule-detail?id=${proposal.recurringOfferId}`);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : proposals.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < proposals.length - 1 ? prev + 1 : 0);
  };

  return (
    <div>
      <Flex align="center" justify="between" className="mb-4">
        <Heading size="4">정기제안 알림</Heading>
        {proposals.length > 1 && (
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
              {currentIndex + 1} / {proposals.length}
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
      {proposals && proposals.length > 0 ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <Flex direction="column" gap="4">
            {/* 안내 문구와 상태 배지 */}
            <Flex align="center" justify="between">
              <Flex align="center" gap="2">
                {(() => {
                  const Icon = getStatusIcon(proposals[currentIndex].recurringStatus);
                  return <Icon size={20} className={getStatusIconColor(proposals[currentIndex].recurringStatus)} />;
                })()}
                <Text size="3" color="gray">
                  {getGuidanceText(proposals[currentIndex].recurringStatus)}
                </Text>
              </Flex>
              <Badge color={getRecurringStatusColor(proposals[currentIndex].recurringStatus) as 'blue' | 'green' | 'red' | 'gray'}>
                {getRecurringStatusKorean(proposals[currentIndex].recurringStatus)}
              </Badge>
            </Flex>

            {/* 일정 요약 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <Flex align="center" gap="2">
                <Calendar size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{proposals[currentIndex].serviceStartDate} ~ {proposals[currentIndex].serviceEndDate}</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Info size={16} className="text-gray-500" />
                <Text size="3" weight="medium">
                  {formatTime(proposals[currentIndex].serviceStartTime)} - {formatTime(proposals[currentIndex].serviceEndTime)}
                </Text>
              </Flex>
              <Flex align="center" gap="2">
                <User size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{proposals[currentIndex].caregiverName} 요양보호사</Text>
              </Flex>
            </div>

            {/* CTA 버튼 */}
            {proposals[currentIndex].recurringStatus !== 'REJECTED' && (
              <Button 
                className="w-full"
                onClick={() => handleViewDetails(proposals[currentIndex])}
              >
                상세 보기
              </Button>
            )}
          </Flex>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <Text size="3" color="gray">새로운 정기 서비스 제안이 없습니다</Text>
        </div>
      )}
    </div>
  );
}
