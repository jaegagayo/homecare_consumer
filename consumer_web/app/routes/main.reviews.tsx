import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Heading,
  Card,
  Badge
} from "@radix-ui/themes";
import { 
  Star,
  Calendar,
  MessageSquare
} from "lucide-react";

interface Review {
  id: string;
  date: string;
  time?: string;
  caregiverName: string;
  serviceType: string;
  rating: number;
  comment: string;
  status: 'pending' | 'completed';
}



export default function ReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 더미 데이터 로드
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReviews([
        {
          id: "1",
          date: "2024-08-13",
          time: "09:00-18:00",
          caregiverName: "김케어",
          serviceType: "방문요양",
          rating: 5,
          comment: "매우 친절하고 전문적인 서비스를 받았습니다. 다음에도 꼭 이용하고 싶어요!",
          status: "completed"
        },
        {
          id: "2",
          date: "2024-08-12",
          time: "10:00-16:00",
          caregiverName: "박케어",
          serviceType: "방문요양",
          rating: 4,
          comment: "시간을 잘 지켜주시고 깔끔하게 서비스를 제공해주셨습니다.",
          status: "completed"
        },
        {
          id: "3",
          date: "2024-08-11",
          time: "14:00-16:00",
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

  const renderStars = (rating: number) => {
    return (
      <Flex gap="1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            fill={star <= rating ? "#fbbf24" : "none"}
            color={star <= rating ? "#fbbf24" : "#d1d5db"}
          />
        ))}
      </Flex>
    );
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
                        navigate(`/main/review-write?serviceId=${review.id}&caregiverName=${review.caregiverName}&serviceType=${review.serviceType}&serviceDate=${review.date}&serviceTime=${review.time || '09:00-18:00'}`);
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
