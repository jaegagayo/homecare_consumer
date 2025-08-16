export interface DateRange {
  start: string | null;
  end: string | null;
}

export type SelectionStep = 'start' | 'end' | 'weekday';
export type SelectionMode = 'range' | 'single';

export interface DatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDates: string[];
  onConfirm: (dates: string[]) => void;
  onClose: () => void;
  mode?: SelectionMode; // 'range' | 'single', 기본값은 'range'
  title?: string; // 다이얼로그 제목
}

export interface DateRangeSelectorProps {
  dateRange: DateRange;
  selectionStep: SelectionStep;
  onDateRangeChange: (range: DateRange) => void;
  onSelectionStepChange: (step: SelectionStep) => void;
  onStepClick: (step: SelectionStep) => void;
}

export interface CalendarProps {
  currentMonth: Date;
  dateRange: DateRange;
  selectionStep: SelectionStep;
  weekdayFilter: boolean[];
  selectedDates: Set<string>;
  onMonthChange: (month: Date) => void;
  onDateSelection: (dateString: string) => void;
  onWeekdayToggle: (index: number) => void;
  onDateToggle: (dateString: string) => void;
  mode: SelectionMode;
}

export interface StepHeaderProps {
  selectionStep: SelectionStep;
  dateRange: DateRange;
  selectedDates: Set<string>;
  onStepClick: (step: SelectionStep) => void;
  mode: SelectionMode;
}
