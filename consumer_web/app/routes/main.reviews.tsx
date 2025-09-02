import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Container,
  Flex,
  Text,
  Button,
  Heading,
  Card
} from "@radix-ui/themes";
import {
  Star,
  Calendar,
  MessageSquare
} from "lucide-react";
import { getWrittenReviews, getPendingReviews } from "../api/review";
import { getStoredConsumerId } from "../api/auth";
import { ConsumerReviewResponse, PendingReviewResponse } from "../types";

// 통합된 리뷰 데이터 타입
interface ReviewData {
  writtenReviews: ConsumerReviewResponse[];
  pendingReviews: PendingReviewResponse[];
}

export default function ReviewsPage() {
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState<ReviewData>({ writtenReviews: [], pendingReviews: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const consumerId = getStoredConsumerId();
        if (!consumerId) {
          throw new Error('로그인이 필요합니다.');
        }

        // 병렬로 두 API 호출
        const [writtenReviews, pendingReviews] = await Promise.all([
          getWrittenReviews(consumerId),
          getPendingReviews(consumerId)
        ]);

        setReviewData({ writtenReviews, pendingReviews });
      } catch (err) {
        console.error('리뷰 데이터 로드 실패:', err);
        setError(err instanceof Error ? err.message : '리뷰 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
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



  const getServiceTypeKorean = (serviceType: string) => {
    switch (serviceType) {
      case 'VISITING_CARE': return '방문요양';
      case 'VISITING_BATH': return '방문목욕';
      case 'VISITING_NURSING': return '방문간호';
      case 'DAY_NIGHT_CARE': return '주야간보호';
      case 'RESPITE_CARE': return '단기보호';
      case 'IN_HOME_SUPPORT': return '재가지원';
      default: return serviceType;
    }
  };

  if (isLoading) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text>리뷰 데이터를 불러오는 중...</Text>
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <Text color="red" size="3">오류가 발생했습니다</Text>
          <Text color="gray" size="2">{error}</Text>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
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
        {reviewData.pendingReviews.length > 0 && (
          <div>
            <Heading size="4" className="mb-4">작성 대기 중인 리뷰</Heading>
            <Flex direction="column" gap="3">
              {reviewData.pendingReviews.map((review) => (
                <Card key={review.serviceMatchId} className="p-4">
                  <Flex justify="between" align="center">
                    <Flex direction="column" gap="2" className="flex-1">
                      <Flex align="center" gap="2">
                        <Calendar size={16} className="text-gray-500" />
                        <Text size="2" weight="medium">
                          {formatDate(review.serviceDate)}
                        </Text>
                      </Flex>
                      <Text size="3" weight="medium">
                        {review.caregiverName} 요양보호사
                      </Text>
                      <Text size="2" color="gray">
                        {getServiceTypeKorean(review.serviceType)}
                      </Text>
                      <Text size="2" color="gray">
                        {review.serviceStartTime} - {review.serviceEndTime}
                      </Text>
                    </Flex>
                    <Button
                      size="2"
                      onClick={() => {
                        navigate(`/main/review-write?serviceMatchId=${review.serviceMatchId}&caregiverName=${review.caregiverName}&serviceType=${review.serviceType}&serviceDate=${review.serviceDate}&serviceTime=${review.serviceStartTime}-${review.serviceEndTime}`);
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
        {reviewData.writtenReviews.length > 0 && (
          <div>
            <Heading size="4" className="mb-4">작성된 리뷰</Heading>
            
            {/* 날짜별로 그룹화된 리뷰 */}
            {(() => {
              // 날짜별로 그룹화
              const groupedByDate = reviewData.writtenReviews.reduce((groups, review) => {
                const date = review.serviceDate;
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(review);
                return groups;
              }, {} as Record<string, typeof reviewData.writtenReviews>);

              // 날짜순으로 정렬 (최신순)
              const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
                new Date(b).getTime() - new Date(a).getTime()
              );

              return (
                <Flex direction="column" gap="4">
                  {sortedDates.map((date, dateIndex) => (
                    <div key={date}>
                      {/* 날짜 헤더 */}
                      <div
                        className="bg-gray-50 mb-4"
                        style={{
                          paddingTop: dateIndex === 0 ? '16px' : '16px',
                        }}
                      >
                        <Heading size="4" style={{ marginTop: '-8px' }}>{formatDate(date)}</Heading>
                      </div>
                      
                      {/* 해당 날짜의 리뷰들 */}
                      <Flex direction="column" gap="3">
                        {groupedByDate[date].map((review, index) => (
                          <Card key={`${date}-${index}`} className="p-4">
                            <Flex direction="column" gap="3">
                              <Flex justify="between" align="start">
                                <Flex direction="column" gap="2" className="flex-1">
                                  <Text size="3" weight="medium">
                                    {review.caregiverName} 요양보호사
                                  </Text>
                                </Flex>
                                <Flex align="center" gap="1">
                                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                  <Text size="2" color="gray">
                                    {review.reviewScore}점
                                  </Text>
                                </Flex>
                              </Flex>

                              {review.reviewContent && (
                                <Text size="2" className="bg-gray-100 p-3 rounded-lg">
                                  {review.reviewContent}
                                </Text>
                              )}
                            </Flex>
                          </Card>
                        ))}
                      </Flex>
                    </div>
                  ))}
                </Flex>
              );
            })()}
          </div>
        )}

        {/* 빈 상태 */}
        {reviewData.pendingReviews.length === 0 && reviewData.writtenReviews.length === 0 && (
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
