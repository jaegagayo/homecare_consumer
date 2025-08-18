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

interface RegularProposal {
  id: string;
  date: string;
  time: string;
  caregiverName: string;
  serviceType: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface RegularProposalNotificationProps {
  proposals: RegularProposal[];
}

export default function RegularProposalNotification({ proposals }: RegularProposalNotificationProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '승인대기';
      case 'approved': return '확정';
      case 'rejected': return '거절';
      default: return '알 수 없음';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'blue';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getGuidanceText = (status: string) => {
    switch (status) {
      case 'pending': return '보호사가 일정을 확인하고 있어요.';
      case 'approved': return '정기 일정이 확정되었어요.';
      case 'rejected': return '정기 일정 신청이 거절되었어요.';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Info;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Info;
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-500';
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const handleViewDetails = (proposal: RegularProposal) => {
    navigate(`/main/schedule-detail?id=${proposal.id}`);
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
                  const Icon = getStatusIcon(proposals[currentIndex].status);
                  return <Icon size={20} className={getStatusIconColor(proposals[currentIndex].status)} />;
                })()}
                <Text size="3" color="gray">
                  {getGuidanceText(proposals[currentIndex].status)}
                </Text>
              </Flex>
              <Badge color={getStatusColor(proposals[currentIndex].status) as any}>
                {getStatusText(proposals[currentIndex].status)}
              </Badge>
            </Flex>

            {/* 일정 요약 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <Flex align="center" gap="2">
                <Calendar size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{proposals[currentIndex].date}</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Info size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{proposals[currentIndex].time}</Text>
              </Flex>
              <Flex align="center" gap="2">
                <User size={16} className="text-gray-500" />
                <Text size="3" weight="medium">{proposals[currentIndex].caregiverName} 요양보호사</Text>
              </Flex>
              <div className="pt-1">
                <Text size="2" color="gray" className="bg-gray-100 px-2 py-1 rounded inline-block">
                  {proposals[currentIndex].serviceType}
                </Text>
              </div>
            </div>

            {/* CTA 버튼 */}
            {proposals[currentIndex].status !== 'rejected' && (
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
