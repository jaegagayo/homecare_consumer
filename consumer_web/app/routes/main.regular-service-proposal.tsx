import { useState } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Heading,
  Select
} from "@radix-ui/themes";

interface RegularServiceForm {
  selectedDays: string[];
  startTime: string;
  endTime: string;
  duration: number;
  startDate: string;
  endDate: string;
}

export default function RegularServiceProposalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const caregiverName = searchParams.get('caregiverName');
  const serviceType = searchParams.get('serviceType');
  const serviceDate = searchParams.get('serviceDate');
  const serviceTime = searchParams.get('serviceTime');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regularServiceForm, setRegularServiceForm] = useState<RegularServiceForm>({
    selectedDays: [],
    startTime: '09:00',
    endTime: '18:00',
    duration: 2,
    startDate: '',
    endDate: ''
  });

  const handleSubmit = async () => {
    if (regularServiceForm.selectedDays.length === 0) {
      alert('서비스 요일을 선택해주세요.');
      return;
    }

    if (!regularServiceForm.startDate || !regularServiceForm.endDate) {
      alert('서비스 기간을 설정해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: 정기 서비스 요청 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('정기 서비스 요청이 등록되었습니다.');
      navigate('/main/reviews');
    } catch (error) {
      alert('정기 서비스 요청 중 오류가 발생했습니다.');
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
          <Heading size="5">정기 서비스 제안</Heading>
          <Text size="3" color="gray">
            만족스러운 서비스였군요! 정기적으로 돌봄 받고 싶으신가요?
          </Text>
        </div>

        {/* 서비스 정보 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-2 block">서비스 정보</Text>
          <Text size="3" weight="medium">{caregiverName} 요양보호사</Text>
          <br />
          <Text size="2" color="gray">{formatDate(serviceDate || '')} {serviceTime}, {serviceType}</Text>
        </div>

        {/* 요일 선택 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-2 block">서비스 요일</Text>
          <Flex gap="2" wrap="wrap">
            {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
              <Button
                key={day}
                size="2"
                variant={regularServiceForm.selectedDays.includes(day) ? "solid" : "outline"}
                onClick={() => {
                  setRegularServiceForm(prev => ({
                    ...prev,
                    selectedDays: prev.selectedDays.includes(day)
                      ? prev.selectedDays.filter(d => d !== day)
                      : [...prev.selectedDays, day]
                  }))
                }}
              >
                {day}
              </Button>
            ))}
          </Flex>
        </div>

        {/* 서비스 기간 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-2 block">서비스 기간</Text>
          <Flex gap="4" align="end">
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">시작일</Text>
              <input
                type="date"
                value={regularServiceForm.startDate}
                onChange={(e) => setRegularServiceForm(prev => ({ ...prev, startDate: e.target.value }))}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--gray-6)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-foreground)',
                  height: '32px',
                  boxSizing: 'border-box',
                  width: '140px'
                }}
              />
            </Flex>
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">종료일</Text>
              <input
                type="date"
                value={regularServiceForm.endDate}
                onChange={(e) => setRegularServiceForm(prev => ({ ...prev, endDate: e.target.value }))}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--gray-6)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-foreground)',
                  height: '32px',
                  boxSizing: 'border-box',
                  width: '140px'
                }}
              />
            </Flex>
          </Flex>
        </div>

        {/* 시간 선택 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-2 block">서비스 시간</Text>
          <Flex gap="2" align="center">
            <Select.Root 
              value={regularServiceForm.startTime} 
              onValueChange={(value) => setRegularServiceForm(prev => ({ ...prev, startTime: value }))}
            >
              <Select.Trigger />
              <Select.Content>
                {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                  <Select.Item key={time} value={time}>{time}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <Text>~</Text>
            <Select.Root 
              value={regularServiceForm.endTime} 
              onValueChange={(value) => setRegularServiceForm(prev => ({ ...prev, endTime: value }))}
            >
              <Select.Trigger />
              <Select.Content>
                {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                  <Select.Item key={time} value={time}>{time}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <Text size="2" color="gray" className="ml-2">
              ({(() => {
                const start = parseInt(regularServiceForm.startTime.split(':')[0]);
                const end = parseInt(regularServiceForm.endTime.split(':')[0]);
                const hours = end - start;
                return hours > 0 ? `${hours}시간` : '시간 설정 필요';
              })()})
            </Text>
          </Flex>
        </div>



        {/* 제출 버튼 */}
        <Flex gap="3" className="mt-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/main/reviews')}
            className="flex-1"
          >
            나중에
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '등록 중...' : '정기 서비스 신청'}
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}
