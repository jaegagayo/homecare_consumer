import { Button, Text } from '@radix-ui/themes';
import { CalendarIcon, ListBulletIcon } from '@radix-ui/react-icons';

interface ViewToggleProps {
  currentView: 'calendar' | 'list';
  onViewChange: (view: 'calendar' | 'list') => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const handleToggle = () => {
    onViewChange(currentView === 'calendar' ? 'list' : 'calendar');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(var(--footer-height, 60px) + var(--spacing-lg, 24px))',
      right: 'var(--spacing-md, 16px)',
      zIndex: 1000
    }}>
      <Button
        size="3"
        onClick={handleToggle}
        style={{
          borderRadius: '24px',
          padding: '12px 20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minWidth: 'auto',
          height: 'auto'
        }}
      >
        {currentView === 'calendar' ? (
          <>
            <ListBulletIcon width="18" height="18" />
            <Text size="2" weight="medium">리스트로 보기</Text>
          </>
        ) : (
          <>
            <CalendarIcon width="18" height="18" />
            <Text size="2" weight="medium">캘린더로 보기</Text>
          </>
        )}
      </Button>
    </div>
  );
}
