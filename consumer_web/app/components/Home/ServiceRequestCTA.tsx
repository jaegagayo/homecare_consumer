import { useNavigate } from "@remix-run/react";
import { 
  Text,
  Button
} from "@radix-ui/themes";
import { ArrowRight, Info } from "lucide-react";

export default function ServiceRequestCTA() {
  const navigate = useNavigate();

  const handleClick = () => {
    // 바우처 안내 페이지로 이동
    navigate("/main/voucher-preview");
  };

  return (
    <div className="space-y-3">
      {/* 방문 요양 신청 버튼 */}
      <Button 
        className="w-full h-auto p-6 bg-accent-9 hover:bg-accent-10 border-0 rounded-xl"
        onClick={handleClick}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {/* 일러스트 */}
            <div className="flex-shrink-0">
              <img 
                src="/cta_illust.svg" 
                alt="방문 요양 일러스트" 
                className="w-12 h-12"
              />
            </div>
            
            {/* 텍스트 */}
            <div className="text-left">
              <Text size="4" weight="bold" className="text-white block">
                방문 요양 신청
              </Text>
              <Text size="2" className="text-white/90 block">
                한 번의 신청으로 일정을 확정하세요
              </Text>
            </div>
          </div>
          
          {/* 화살표 아이콘 */}
          <ArrowRight size={24} className="text-white flex-shrink-0" />
        </div>
      </Button>

      {/* 안내 정보 */}
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <Text size="2">
          '방문간호', '단기보호', '주야간 보호서비스' 등은 준비중에 있습니다.
        </Text>
      </div>
    </div>
  );
}
