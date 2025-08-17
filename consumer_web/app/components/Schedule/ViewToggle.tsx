import { Flex, SegmentedControl, Text } from '@radix-ui/themes';
import { CalendarIcon, ListBulletIcon } from '@radix-ui/react-icons';

interface ViewToggleProps {
  currentView: 'calendar' | 'list';
  onViewChange: (view: 'calendar' | 'list') => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <Flex justify="center" style={{ width: '100%', padding: '16px 0' }}>
      <SegmentedControl.Root 
        value={currentView} 
        onValueChange={onViewChange}
        size="2"
        style={{ width: '100%' }}
      >
        <SegmentedControl.Item value="calendar" style={{ flex: 1 }}>
          <Flex align="center" gap="1" justify="center">
            <CalendarIcon width="14" height="14" />
            <Text size="2">캘린더 보기</Text>
          </Flex>
        </SegmentedControl.Item>
        <SegmentedControl.Item value="list" style={{ flex: 1 }}>
          <Flex align="center" gap="1" justify="center">
            <ListBulletIcon width="14" height="14" />
            <Text size="2">리스트 보기</Text>
          </Flex>
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    </Flex>
  );
}
