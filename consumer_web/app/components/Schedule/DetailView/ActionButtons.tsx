import { useNavigate } from '@remix-run/react';
import { Flex, Button, Text } from '@radix-ui/themes';
import { StarIcon } from '@radix-ui/react-icons';
import { ConsumerScheduleDetailResponse } from '../../../types/schedule';

interface ActionButtonsProps {
  schedule: ConsumerScheduleDetailResponse;
  hasReview: boolean;
  onViewReview: () => void;
  onHideReview: () => void;
  showReview: boolean;
  isReviewLoading: boolean;
}

export default function ActionButtons({ 
  schedule, 
  hasReview, 
  onViewReview, 
  onHideReview, 
  showReview,
  isReviewLoading
}: ActionButtonsProps) {
  const navigate = useNavigate();

  const handleWriteReview = () => {
    if (!schedule) return;
    
    navigate(`/main/review-write?serviceId=${schedule.serviceMatchId}&serviceType=${schedule.serviceType}&serviceDate=${schedule.serviceDate}&serviceTime=${schedule.serviceStartTime}-${schedule.serviceEndTime}`);
  };

  return (
    <Flex direction="column" gap="4">
      {/* 완료된 일정의 경우 리뷰 버튼 */}
      {schedule.matchStatus === 'COMPLETED' && (
        <>
          {hasReview ? (
            showReview ? (
              <Button 
                variant="outline" 
                onClick={onHideReview}
                style={{ width: '100%' }}
              >
                <StarIcon width="16" height="16" />
                리뷰 숨기기
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={onViewReview}
                disabled={isReviewLoading}
                style={{ width: '100%' }}
              >
                <StarIcon width="16" height="16" />
                {isReviewLoading ? '로딩 중...' : '작성한 리뷰 보기'}
              </Button>
            )
          ) : (
            <Button 
              onClick={handleWriteReview}
              style={{ width: '100%' }}
            >
              <StarIcon width="16" height="16" />
              리뷰 작성
            </Button>
          )}
        </>
      )}

      {/* 승인대기, 예정 상태는 안내 메시지 */}
      {(schedule.matchStatus === 'CONFIRMED') && (
        <Text size="2" color="gray" style={{ textAlign: 'center' }}>
          확정된 일정입니다.
        </Text>
      )}

      {/* 일정 목록으로 돌아가기 버튼 */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/main/schedule')}
        style={{ width: '100%' }}
      >
        일정 목록으로 돌아가기
      </Button>
    </Flex>
  );
}

