import { useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text
} from "@radix-ui/themes";
import { ConsumerScheduleDetailResponse } from "../../../types/schedule";
import { getScheduleDetail } from "../../../api/schedule";
import ServiceInfoCard from './ServiceInfoCard';
import CaregiverInfoCard from './CaregiverInfoCard';
import VisitLocationCard from './VisitLocationCard';
import PaymentInfoCard from './PaymentInfoCard';

import SpecialNotesCard from './SpecialNotesCard';
import ActionButtons from './ActionButtons';

export default function ScheduleDetailPage() {
  const [searchParams] = useSearchParams();
  const [schedule, setSchedule] = useState<ConsumerScheduleDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasReview, setHasReview] = useState(false);

  const scheduleId = searchParams.get('id');

  useEffect(() => {
    const loadScheduleDetail = async () => {
      if (!scheduleId) {
        setError("일정 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // 일정 상세 조회 API 호출
        const scheduleData = await getScheduleDetail(scheduleId);
        setSchedule(scheduleData);
        setHasReview(!scheduleData.hasReview);
      } catch (error) {
        console.error('Failed to load schedule detail:', error);
        setError("일정 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadScheduleDetail();
  }, [scheduleId]);

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

  if (error) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <Text color="red">{error}</Text>
        </Flex>
      </Container>
    );
  }

  if (!schedule) {
    return (
      <Container size="2" className="p-4">
        <Flex direction="column" align="center" gap="4" className="py-8">
          <Text>일정을 찾을 수 없습니다.</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="2" className="p-4">
      <Flex direction="column" gap="6">
        {/* 서비스 정보 카드 */}
        <ServiceInfoCard schedule={schedule} />
        
        {/* 요양보호사 정보 카드 */}
        <CaregiverInfoCard schedule={schedule} />
        
        {/* 방문 장소 카드 */}
        <VisitLocationCard schedule={schedule} />
        
        {/* 결제 정보 카드 */}
        <PaymentInfoCard schedule={schedule} />
        
        {/* 정기 일정 카드 (정기 일정인 경우에만 표시) */}
        {/* <RegularScheduleCard schedule={schedule} /> */}
        
        {/* 특이사항 카드 */}
        <SpecialNotesCard schedule={schedule} />
        
        {/* 액션 버튼들 */}
        <ActionButtons schedule={schedule} hasReview={hasReview} />
      </Flex>
    </Container>
  );
}
