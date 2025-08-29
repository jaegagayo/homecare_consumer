import { Flex, Text, Card, Button } from '@radix-ui/themes';
import { Phone, User, Contact } from 'lucide-react';
import { Schedule } from '../../../types/schedule';

interface CaregiverInfoCardProps {
  schedule: Schedule;
}

export default function CaregiverInfoCard({ schedule }: CaregiverInfoCardProps) {
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <Card className="p-4">
      <Flex direction="column" gap="4">
        {/* 헤더 */}
        <Flex align="center" gap="2">
          <div 
            style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: 'var(--accent-9)', 
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Contact size={12} style={{ color: 'white' }} />
          </div>
          <Text size="3" weight="medium">요양보호사 정보</Text>
        </Flex>

        {/* 요양보호사 연락처 */}
        <Flex gap="3" align="center">
          <User size={16} style={{ color: 'var(--accent-9)' }} />
          <Flex direction="column" gap="1" style={{ flex: 1 }}>
            <Text size="3" weight="medium">요양보호사</Text>
            <Text size="2" color="gray">010-1234-5678</Text>
          </Flex>
          <div
            onClick={() => handleCall("010-1234-5678")}
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              backgroundColor: 'var(--gray-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gray-4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gray-3)';
            }}
          >
            <Phone size={18} style={{ color: 'var(--accent-9)' }} />
          </div>
        </Flex>
      </Flex>
    </Card>
  );
}

