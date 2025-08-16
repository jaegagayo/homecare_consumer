export interface ServicePeriodCalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestedDates: string[];
  title?: string;
}

export interface CalendarViewProps {
  currentMonth: Date;
  requestedDates: string[];
  onMonthChange: (month: Date) => void;
}
