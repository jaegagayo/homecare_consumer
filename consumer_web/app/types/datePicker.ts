export interface DateRange {
  start: string | null;
  end: string | null;
}

export type SelectionStep = 'start' | 'end' | 'weekday';

export interface DatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDates: string[];
  onConfirm: (dates: string[]) => void;
  onClose: () => void;
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
}

export interface StepHeaderProps {
  selectionStep: SelectionStep;
  dateRange: DateRange;
  selectedDates: Set<string>;
  onStepClick: (step: SelectionStep) => void;
}
