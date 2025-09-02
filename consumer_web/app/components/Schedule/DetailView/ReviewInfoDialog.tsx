import { 
  Flex, 
  Text,
  Button,
  Badge,
  Dialog,
  Card
} from "@radix-ui/themes";
import { Star, Calendar, Clock, X } from "lucide-react";
import { GetReviewResponse } from "../../../types/review";
import { ServiceType } from "../../../types/home";
import { getServiceTypeKorean } from "../../../utils/koreanTranslations";

interface ReviewInfoDialogProps {
  review: GetReviewResponse | null;
  caregiverName: string;
  serviceDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
  serviceType: ServiceType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReviewInfoDialog({ 
  review, 
  caregiverName, 
  serviceDate, 
  serviceStartTime, 
  serviceEndTime, 
  serviceType,
  open,
  onOpenChange
}: ReviewInfoDialogProps) {

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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Flex direction="column" gap="4">
          {/* 헤더 */}
          <Flex justify="between" align="center">
            <Dialog.Title className="flex items-center">작성한 리뷰</Dialog.Title>
            <Button
              variant="ghost"
              size="2"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-1 self-center -mt-4"
            >
              <X size={16} />
              <Text size="2" weight="medium">닫기</Text>
            </Button>
          </Flex>

          {/* 서비스 정보 */}
          <Card className="p-4">
            <Flex direction="column" gap="3">
              <Flex justify="between" align="start">
                <Flex direction="column" gap="2" className="flex-1">
                  <Flex align="center" gap="2">
                    <Calendar size={16} className="text-gray-500" />
                    <Text size="2" weight="medium">
                      {formatDate(serviceDate)}
                    </Text>
                  </Flex>
                  <Text size="3" weight="medium">
                    {caregiverName} 요양보호사
                  </Text>
                  <Text size="2" color="gray">
                    {getServiceTypeKorean(serviceType)}
                  </Text>
                  <Flex align="center" gap="2">
                    <Clock size={16} className="text-gray-500" />
                    <Text size="2" color="gray">
                      {serviceStartTime} - {serviceEndTime}
                    </Text>
                  </Flex>
                </Flex>
                <Badge color="green">작성 완료</Badge>
              </Flex>
            </Flex>
          </Card>

          {/* 리뷰 평가 */}
          {review && (
            <>
              {/* 별점 */}
              <Card className="p-4">
                <div className="space-y-3">
                  <Text size="2" weight="medium" color="gray">평점</Text>
                  <div className="flex items-center gap-3">
                    {renderStars(review.reviewScore)}
                    <Text size="3" weight="medium">
                      {review.reviewScore}점
                    </Text>
                  </div>
                </div>
              </Card>

              {/* 리뷰 내용 */}
              {review.reviewContent && (
                <Card className="p-4">
                  <div className="space-y-3">
                    <Text size="2" weight="medium" color="gray">리뷰 내용</Text>
                    <Text size="3" className="bg-gray-50 p-3 rounded-lg">
                      {review.reviewContent}
                    </Text>
                  </div>
                </Card>
              )}

              {/* 작성 일시 */}
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <Text size="2" color="gray">
                    작성일: {formatDate(review.createdAt)}
                  </Text>
                </div>
              </Card>
            </>
          )}

          {/* 닫기 버튼 */}
          <Flex gap="3" className="mt-4">
            <Button 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              닫기
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
