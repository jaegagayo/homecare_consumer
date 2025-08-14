import { useState, useEffect } from "react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Heading,
  Card,
  Badge,
  TextArea,
  Select,
  Dialog
} from "@radix-ui/themes";
import { 
  Star,
  Calendar,
  User,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  X
} from "lucide-react";

interface Review {
  id: string;
  date: string;
  caregiverName: string;
  serviceType: string;
  rating: number;
  comment: string;
  status: 'pending' | 'completed';
}

interface ReviewForm {
  rating: number;
  comment: string;
  isBlacklist: boolean;
  blacklistReason: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 0,
    comment: '',
    isBlacklist: false,
    blacklistReason: ''
  });

  useEffect(() => {
    // 더미 데이터 로드
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReviews([
        {
          id: "1",
          date: "2024-08-13",
          caregiverName: "김케어",
          serviceType: "방문요양",
          rating: 5,
          comment: "매우 친절하고 전문적인 서비스를 받았습니다. 다음에도 꼭 이용하고 싶어요!",
          status: "completed"
        },
        {
          id: "2",
          date: "2024-08-12",
          caregiverName: "박케어",
          serviceType: "방문요양",
          rating: 4,
          comment: "시간을 잘 지켜주시고 깔끔하게 서비스를 제공해주셨습니다.",
          status: "completed"
        },
        {
          id: "3",
          date: "2024-08-11",
          caregiverName: "이케어",
          serviceType: "방문목욕",
          rating: 0,
          comment: "",
          status: "pending"
        }
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <Flex gap="1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            onClick={interactive ? () => setReviewForm(prev => ({ ...prev, rating: star })) : undefined}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              size={20}
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

    // TODO: 실제 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('리뷰가 성공적으로 등록되었습니다.');
    setShowReviewForm(false);
    setReviewForm({
      rating: 0,
      comment: '',
      isBlacklist: false,
      blacklistReason: ''
    });
  };

  if (isLoading) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text>로딩 중...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 헤더 */}
        <div>
          <Heading size="5">리뷰 관리</Heading>
          <Text size="3" color="gray">
            받은 서비스에 대한 리뷰를 작성하세요
          </Text>
        </div>

        {/* 작성 대기 중인 리뷰 */}
        {reviews.filter(r => r.status === 'pending').length > 0 && (
          <div>
            <Heading size="4" className="mb-4">작성 대기 중인 리뷰</Heading>
            <Flex direction="column" gap="3">
              {reviews.filter(r => r.status === 'pending').map((review) => (
                <Card key={review.id} className="p-4">
                  <Flex justify="between" align="center">
                    <Flex direction="column" gap="2" className="flex-1">
                      <Flex align="center" gap="2">
                        <Calendar size={16} className="text-gray-500" />
                        <Text size="2" weight="medium">
                          {formatDate(review.date)}
                        </Text>
                      </Flex>
                      <Text size="3" weight="medium">
                        {review.caregiverName} 요양보호사
                      </Text>
                      <Text size="2" color="gray">
                        {review.serviceType}
                      </Text>
                    </Flex>
                    <Button 
                      size="2" 
                      onClick={() => {
                        setSelectedService(review.id);
                        setShowReviewForm(true);
                      }}
                    >
                      <MessageSquare size={16} />
                      <Text>리뷰 작성</Text>
                    </Button>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </div>
        )}

        {/* 작성된 리뷰 */}
        {reviews.filter(r => r.status === 'completed').length > 0 && (
          <div>
            <Heading size="4" className="mb-4">작성된 리뷰</Heading>
            <Flex direction="column" gap="3">
              {reviews.filter(r => r.status === 'completed').map((review) => (
                <Card key={review.id} className="p-4">
                  <Flex direction="column" gap="3">
                    <Flex justify="between" align="start">
                      <Flex direction="column" gap="2" className="flex-1">
                        <Flex align="center" gap="2">
                          <Calendar size={16} className="text-gray-500" />
                          <Text size="2" weight="medium">
                            {formatDate(review.date)}
                          </Text>
                        </Flex>
                        <Text size="3" weight="medium">
                          {review.caregiverName} 요양보호사
                        </Text>
                        <Text size="2" color="gray">
                          {review.serviceType}
                        </Text>
                      </Flex>
                      <Badge color="green">작성 완료</Badge>
                    </Flex>
                    
                    <div>
                      {renderStars(review.rating)}
                    </div>
                    
                    {review.comment && (
                      <Text size="2" className="bg-gray-50 p-3 rounded-lg">
                        {review.comment}
                      </Text>
                    )}
                  </Flex>
                </Card>
              ))}
            </Flex>
          </div>
        )}


      {/* 리뷰 작성 다이얼로그 */}
      <Dialog.Root open={showReviewForm} onOpenChange={setShowReviewForm}>
        <Dialog.Content>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Dialog.Title className="flex items-center">리뷰 작성</Dialog.Title>
              <Button 
                variant="ghost" 
                size="2"
                onClick={() => setShowReviewForm(false)}
                className="flex items-center gap-1 self-center -mt-4"
              >
                <X size={16} />
                <Text size="2" weight="medium">닫기</Text>
              </Button>
            </Flex>
            
            <Flex direction="column" gap="4">
              {/* 평점 선택 */}
              <div>
                <Text size="2" weight="medium" className="mb-2 block">평점</Text>
                {renderStars(reviewForm.rating, true)}
              </div>

              {/* 리뷰 내용 */}
              <div>
                <Text size="2" weight="medium" className="mb-2 block">리뷰 내용</Text>
                <TextArea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="서비스에 대한 솔직한 리뷰를 작성해주세요"
                  rows={4}
                />
              </div>

              {/* 블랙리스트 신고 */}
              {reviewForm.rating <= 2 && (
                <div>
                  <Text size="2" weight="medium" className="mb-2 block">
                    블랙리스트 신고 (선택사항)
                  </Text>
                  <TextArea
                    value={reviewForm.blacklistReason}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, blacklistReason: e.target.value }))}
                    placeholder="블랙리스트 신고 사유를 입력해주세요"
                    rows={3}
                  />
                </div>
              )}
            </Flex>

            <Flex gap="3" className="mt-4">
              <Button 
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button onClick={handleSubmitReview} className="flex-1">
                리뷰 등록
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

        {/* 빈 상태 */}
        {reviews.length === 0 && (
          <Card className="p-8 text-center">
            <MessageSquare size={48} className="text-gray-400 mx-auto mb-3" />
            <Text size="3" color="gray">작성할 리뷰가 없습니다</Text>
            <Text size="2" color="gray">완료된 서비스에 대해서만 리뷰를 작성할 수 있습니다</Text>
          </Card>
        )}
      </Flex>
    </Container>
  );
}
