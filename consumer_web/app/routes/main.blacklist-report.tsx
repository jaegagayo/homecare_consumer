import { useState } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { 
  Container, 
  Flex, 
  Text, 
  Button,
  Heading,
  TextArea,
  Card
} from "@radix-ui/themes";

interface BlacklistForm {
  reason: string;
  permanent: boolean;
  contactAdmin: boolean;
}

export default function BlacklistReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const caregiverName = searchParams.get('caregiverName');
  const serviceType = searchParams.get('serviceType');
  const serviceDate = searchParams.get('serviceDate');
  const serviceTime = searchParams.get('serviceTime');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blacklistForm, setBlacklistForm] = useState<BlacklistForm>({
    reason: '',
    permanent: false,
    contactAdmin: false
  });

  const handleSubmit = async () => {
    if (!blacklistForm.reason.trim()) {
      alert('신고 사유를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: 블랙리스트 신고 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('블랙리스트 신고가 등록되었습니다.');
      navigate('/main/reviews');
    } catch (error) {
      alert('블랙리스트 신고 중 오류가 발생했습니다.');
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
      <Flex direction="column" gap="4">
        {/* 헤더 */}
        <div>
          <Heading size="5">블랙리스트 신고</Heading>
          <Text size="3" color="gray">
            불만족스러운 서비스였군요. 해당 요양보호사를 블랙리스트에 등록하시겠습니까?
          </Text>
        </div>

        {/* 서비스 정보 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-2 block">서비스 정보</Text>
          <Text size="3" weight="medium">{caregiverName} 요양보호사</Text>
          <br />
          <Text size="2" color="gray">{formatDate(serviceDate || '')} {serviceTime}, {serviceType}</Text>
        </div>

        {/* 신고 사유 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-2 block">신고 사유</Text>
          <TextArea
            value={blacklistForm.reason}
            onChange={(e) => setBlacklistForm(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="블랙리스트 신고 사유를 상세히 작성해주세요"
            rows={4}
          />
        </div>

        {/* 블랙리스트 옵션 */}
        <div>
          <Text size="2" weight="medium" color="gray" className="mb-2 block">블랙리스트 설정</Text>
          <Flex direction="column" gap="3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={blacklistForm.permanent}
                onChange={(e) => setBlacklistForm(prev => ({ ...prev, permanent: e.target.checked }))}
                className="rounded w-4 h-4"
              />
              <Text size="3">영구 블랙리스트 (해제 불가)</Text>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={blacklistForm.contactAdmin}
                onChange={(e) => setBlacklistForm(prev => ({ ...prev, contactAdmin: e.target.checked }))}
                className="rounded w-4 h-4"
              />
              <Text size="3">관리자에게 즉시 신고</Text>
            </label>
          </Flex>
        </div>

        {/* 주의사항 */}
        <Card className="p-4 bg-red-50 border border-red-200">
          <Text size="2" color="red" className="leading-relaxed">
            ⚠️ 블랙리스트 신고는 신중하게 결정해주세요. 
            허위 신고 시 제재를 받을 수 있으며, 
            영구 블랙리스트는 해제가 불가능합니다.
          </Text>
        </Card>

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
            variant="solid"
            color="red"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '등록 중...' : '블랙리스트 신고'}
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}
