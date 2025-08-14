import { useState } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Heading,
  TextArea
} from "@radix-ui/themes";
import { 
  Star
} from "lucide-react";

interface ReviewForm {
  rating: number;
  comment: string;
  isBlacklist: boolean;
  blacklistReason: string;
}



export default function ReviewWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId');
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
      
        // 평점에 따른 후속 페이지로 이동
        if (reviewForm.rating >= 4) {
          // 4점 이상일 때 정기제안 페이지로 이동
          navigate(`/main/regular-service-proposal?serviceId=${serviceId}&caregiverName=${caregiverName}&serviceType=${serviceType}&serviceDate=${serviceDate}&serviceTime=${serviceTime}`);
        } else if (reviewForm.rating <= 2) {
          // 2점 이하일 때 블랙리스트 페이지로 이동
          navigate(`/main/blacklist-report?serviceId=${serviceId}&caregiverName=${caregiverName}&serviceType=${serviceType}&serviceDate=${serviceDate}&serviceTime=${serviceTime}`);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <Text size="2" color="gray">{formatDate(serviceDate || '')} {serviceTime}, {serviceType}</Text>
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
    </Container>
  );
}
