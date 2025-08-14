import { DashboardIcon, PersonIcon, CalendarIcon, GearIcon, BellIcon } from '@radix-ui/react-icons';
import React from 'react';

// 원화 기호가 포함된 커스텀 아이콘
const WonIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    ref={ref}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="11"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="12"
      fontWeight="bold"
      fill="currentColor"
    >
      ₩
    </text>
  </svg>
));

WonIcon.displayName = 'WonIcon';

export const MENU = [
  { key: 'dashboard', label: '현황판', icon: <DashboardIcon width={24} height={24} /> },
  { key: 'caregiver', label: '요양보호사', icon: <PersonIcon width={24} height={24} /> },
  { key: 'calendar', label: '캘린더', icon: <CalendarIcon width={24} height={24} /> },
  { key: 'settlement', label: '정산 관리', icon: <WonIcon /> },
  { key: 'settings', label: '설정', icon: <GearIcon width={24} height={24} /> },
  { key: 'notifications', label: '알림', icon: <BellIcon width={24} height={24} /> },
]; 