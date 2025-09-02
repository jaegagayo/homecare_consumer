import { useState } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import {
  Container,
  Flex,
  Text,
  Button,
  Heading,
  TextArea,
  Card,
  Dialog
} from "@radix-ui/themes";
import {
  Star,
  X
} from "lucide-react";
import { BlacklistRegistrationDialog } from "../components/Blacklist";
import { getServiceTypeKorean } from "../utils/koreanTranslations";
import { ServiceType } from "../types";

interface ReviewForm {
  rating: number;
  comment: string;
  isBlacklist: boolean;
  blacklistReason: string;
}



export default function ReviewWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceMatchId = searchParams.get('serviceMatchId');
  const caregiverName = searchParams.get('caregiverName');
  const serviceType = searchParams.get('serviceType');
  const serviceDate = searchParams.get('serviceDate');
  const serviceTime = searchParams.get('serviceTime');

  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 0,
    comment: '',
    isBlacklist: false,
    blacklistReason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);
  const [isRegularServiceDialogOpen, setIsRegularServiceDialogOpen] = useState(false);

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <Flex gap="2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            onClick={interactive ? () => setReviewForm(prev => ({ ...prev, rating: star })) : undefined}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              size={32}
              fill={star <= rating ? "#fbbf24" : "none"}
              color={star <= rating ? "#fbbf24" : "#d1d5db"}
            />
          </button>
        ))}
      </Flex>
    );
  };

  const handleSubmitReview = async () => {
    if (reviewForm.rating === 0) {
      alert('평점을 선택해주세요.');
      return;
    }

    if (reviewForm.comment.trim() === '') {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 실제 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('리뷰가 성공적으로 등록되었습니다.');

      // 평점에 따른 후속 처리
      if (reviewForm.rating >= 4) {
        // 4점 이상일 때 정기제안 페이지로 이동
        setIsRegularServiceDialogOpen(true);
      } else if (reviewForm.rating <= 2) {
        // 2점 이하일 때 블랙리스트 다이얼로그 표시
        setIsBlacklistDialogOpen(true);
      } else {
        // 3점일 때 바로 리뷰 페이지로 이동
        navigate('/main/reviews');
      }
    } catch (error) {
      alert('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlacklistConfirm = async () => {
    try {
      // TODO: 블랙리스트 등록 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('블랙리스트에 등록되었습니다.');
      navigate('/main/home');
    } catch (error) {
      alert('블랙리스트 등록 중 오류가 발생했습니다.');
    }
  };

  const handleBlacklistCancel = () => {
    setIsBlacklistDialogOpen(false);
    navigate('/main/home');
  };

  const handleRegularServiceConfirm = () => {
    navigate(`/main/regular-service-proposal?serviceMatchId=${serviceMatchId}&caregiverName=${caregiverName}&serviceType=${serviceType}&serviceDate=${serviceDate}&serviceTime=${serviceTime}`);
    setIsRegularServiceDialogOpen(false);
  };

  const handleRegularServiceCancel = () => {
    setIsRegularServiceDialogOpen(false);
    navigate('/main/home');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // HH:MM:SS 형식에서 HH:MM 형식으로 변환
    return timeString.substring(0, 5);
  };

  const formatTimeRange = (timeRangeString: string) => {
    if (!timeRangeString) return '';
    
    // "14:00:00-18:00:00" 형식을 "14:00 - 18:00" 형식으로 변환
    if (timeRangeString.includes('-')) {
      const [startTime, endTime] = timeRangeString.split('-');
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }
    
    // 단일 시간인 경우
    return formatTime(timeRangeString);
  };

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 헤더 */}
        <div>
          <Heading size="5">리뷰 작성</Heading>
          <Text size="3" color="gray">
            받은 서비스에 대한 솔직한 리뷰를 작성해주세요
          </Text>
        </div>

        {/* 서비스 정보 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-2 block">서비스 정보</Text>
          <Text size="3" weight="medium">{caregiverName} 요양보호사</Text>
          <br />
          <Text size="2" color="gray">
            {formatDate(serviceDate || '')} {formatTimeRange(serviceTime || '')}, {getServiceTypeKorean(serviceType as ServiceType)}
          </Text>
        </div>

        {/* 평점 선택 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-4 block">평점</Text>
          {renderStars(reviewForm.rating, true)}
        </div>

        {/* 리뷰 내용 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-2 block">리뷰 내용</Text>
          <TextArea
            value={reviewForm.comment}
            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="서비스에 대한 솔직한 리뷰를 작성해주세요"
            rows={4}
          />
        </div>

        {/* 제출 버튼 */}
        <Flex gap="3" className="mt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/main/reviews')}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmitReview}
            disabled={isSubmitting || reviewForm.rating === 0 || reviewForm.comment.trim() === ''}
            className="flex-1"
          >
            {isSubmitting ? '등록 중...' : '리뷰 등록'}
          </Button>
        </Flex>
      </Flex>

      {/* 블랙리스트 등록 다이얼로그 */}
      <BlacklistRegistrationDialog
        open={isBlacklistDialogOpen}
        onOpenChange={setIsBlacklistDialogOpen}
        caregiverName={caregiverName || ''}
        serviceType={getServiceTypeKorean(serviceType as ServiceType)}
        serviceDate={serviceDate || ''}
        serviceTime={serviceTime || ''}
        onConfirm={handleBlacklistConfirm}
        onCancel={handleBlacklistCancel}
      />

      {/* 정기 신청 확인 다이얼로그 */}
      <Dialog.Root open={isRegularServiceDialogOpen} onOpenChange={setIsRegularServiceDialogOpen}>
        <Dialog.Content>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Dialog.Title className="flex items-center">정기 서비스 신청</Dialog.Title>
              <Button
                variant="ghost"
                size="2"
                onClick={() => setIsRegularServiceDialogOpen(false)}
                className="flex items-center gap-1 self-center -mt-4"
              >
                <X size={16} />
                <Text size="2" weight="medium">닫기</Text>
              </Button>
            </Flex>

            {/* 안내 문구 */}
            <Text size="3" color="gray">
              서비스가 만족스러우셨군요.<br />
              해당 요양보호사와 정기 서비스를 신청하시겠습니까?
            </Text>

            {/* 서비스 정보 카드 */}
            <Card className="p-4">
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium" color="gray">서비스 정보</Text>
                <Text size="3" weight="medium">{caregiverName} 요양보호사</Text>
                <Text size="2" color="gray">
                  {formatDate(serviceDate || '')} {formatTimeRange(serviceTime || '')}, {getServiceTypeKorean(serviceType as ServiceType)}
                </Text>
              </Flex>
            </Card>

            {/* CTA 버튼 */}
            <Flex gap="3" className="mt-4">
              <Button
                variant="outline"
                onClick={handleRegularServiceCancel}
                className="flex-1"
              >
                나중에 하기
              </Button>
              <Button
                onClick={handleRegularServiceConfirm}
                className="flex-1"
              >
                정기 서비스 신청
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Container>
  );
}
