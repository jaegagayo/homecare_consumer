import { useNavigate } from '@remix-run/react';
import { Flex, Button, Text } from '@radix-ui/themes';
import { StarIcon } from '@radix-ui/react-icons';
import { Schedule } from '../../../types/schedule';

interface ActionButtonsProps {
  schedule: Schedule;
  scheduleId: string;
  hasReview: boolean;
}

export default function ActionButtons({ schedule, scheduleId, hasReview }: ActionButtonsProps) {
  const navigate = useNavigate();

  const handleWriteReview = () => {
    if (!schedule) return;
    
    navigate(`/main/review-write?serviceId=${schedule.id}&serviceType=${schedule.serviceType}&serviceDate=${schedule.date}&serviceTime=${schedule.time}`);
  };

  const handleViewReview = () => {
    // TODO: 작성된 리뷰 보기 페이지로 이동
    navigate(`/main/reviews?reviewId=${schedule?.id}`);
  };

  return (
    <Flex direction="column" gap="4">
      {/* 완료된 일정의 경우 리뷰 버튼 */}
      {schedule.status === 'completed' && (
        <>
          {hasReview ? (
            <Button 
              variant="outline" 
              onClick={handleViewReview}
              style={{ width: '100%' }}
            >
              <StarIcon width="16" height="16" />
              작성한 리뷰 보기
            </Button>
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
      {(schedule.status === 'upcoming') && (
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

