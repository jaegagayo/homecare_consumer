import { Flex, Text, Badge, RadioCards } from "@radix-ui/themes";
import { Star, User, Briefcase, Brain, Bed, MapPin } from "lucide-react";
import { Caregiver } from "../../types/matching";

interface CaregiverCardProps {
  caregiver: Caregiver;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const getKoreanProficiencyColor = (proficiency: Caregiver['koreanProficiency']) => {
  switch (proficiency) {
    case 'native': return 'green';
    case 'advanced': return 'blue';
    case 'intermediate': return 'orange';
    case 'basic': return 'red';
    default: return 'gray';
  }
};

const getKoreanProficiencyText = (proficiency: Caregiver['koreanProficiency']) => {
  switch (proficiency) {
    case 'native': return '원어민';
    case 'advanced': return '고급';
    case 'intermediate': return '중급';
    case 'basic': return '기본';
    default: return '기본';
  }
};

export default function CaregiverCard({ caregiver, isSelected, onSelect }: CaregiverCardProps) {
  return (
    <RadioCards.Item value={caregiver.id} className="w-full">
      <div className="w-full p-2">
        {/* 카드 상단 섹션 */}
        <div className="flex gap-4 mb-4">
          {/* 프로필 이미지 섹션 */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-accent-3 to-accent-6 rounded-lg border border-accent-6 flex items-center justify-center">
              <User size={32} className="text-accent-11" />
            </div>
          </div>

          {/* 기본 정보 섹션 */}
          <div className="flex-1 h-20 flex flex-col justify-between">
            {/* 이름과 전체 평점 */}
            <div className="flex justify-between items-start">
              <Text size="4" weight="bold" className="text-gray-900">
                {caregiver.name}
              </Text>
              <div className="flex items-center gap-1">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <Text size="2" weight="medium" className="text-gray-700">
                  {caregiver.rating} ({Math.floor(Math.random() * 100) + 20})
                </Text>
              </div>
            </div>

            {/* 성별, 나이, 경력 */}
            <div className="flex items-center gap-3">
              <Text size="2" color="gray">
                {caregiver.age}세 ({caregiver.gender === 'female' ? '여' : '남'})
              </Text>
              <div className="flex items-center gap-1">
                <Briefcase size={14} className="text-accent-9" />
                <Text size="2" color="gray">
                  경력 {caregiver.experience}년
                </Text>
              </div>
            </div>

            {/* 특징 뱃지 */}
            <div className="flex gap-2">
              <Badge color="green" className="flex items-center gap-1 px-2 py-1">
                <MapPin size={12} />
                <Text size="1" weight="medium">외출가능</Text>
              </Badge>
              <Badge color={getKoreanProficiencyColor(caregiver.koreanProficiency)} className="flex items-center gap-1 px-2 py-1">
                <User size={12} />
                <Text size="1" weight="medium">한국어 - {getKoreanProficiencyText(caregiver.koreanProficiency)}</Text>
              </Badge>
            </div>
          </div>
        </div>

        {/* 세부 통계/경험 섹션 */}
        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3">
              {/* 거절률 */}
              <div className="text-center relative">
                <Text size="1" color="gray" className="block mb-1">거절률</Text>
                <Text 
                  size="2" 
                  weight="bold"
                  color={caregiver.rejectionRate > 5 ? "red" : caregiver.rejectionRate > 3 ? "orange" : "green"}
                >
                  {caregiver.rejectionRate}%
                </Text>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-200"></div>
              </div>

              {/* 치매 경험 */}
              <div className="text-center relative">
                <Text size="1" color="gray" className="block mb-1">치매 경험</Text>
                <Flex align="center" justify="center" gap="1">
                  <Brain size={14} className="text-accent-9" />
                  <Text size="2" weight="bold">
                    {caregiver.specialCaseExperience.dementia ? "12회" : "0회"}
                  </Text>
                </Flex>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-200"></div>
              </div>

              {/* 와상 경험 */}
              <div className="text-center">
                <Text size="1" color="gray" className="block mb-1">와상 경험</Text>
                <Flex align="center" justify="center" gap="1">
                  <Bed size={14} className="text-red-9" />
                  <Text size="2" weight="bold">
                    {caregiver.specialCaseExperience.bedridden ? "4회" : "0회"}
                  </Text>
                </Flex>
              </div>
            </div>
          </div>
        </div>

        {/* 자기소개 */}
        <div>
          <Text size="2" color="gray" className="leading-relaxed italic">
            &ldquo;{caregiver.selfIntroduction}&rdquo;
          </Text>
        </div>
      </div>
    </RadioCards.Item>
  );
}
