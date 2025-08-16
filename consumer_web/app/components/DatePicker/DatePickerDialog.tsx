import { useState, useEffect } from "react";
import { Flex, Button, Dialog } from "@radix-ui/themes";
import { X } from "lucide-react";
import { DatePickerProps, DateRange, SelectionStep } from "../../types";
import StepHeader from "./StepHeader";
import Calendar from "./Calendar";

export default function DatePickerDialog({
  open,
  onOpenChange,
  selectedDates: initialSelectedDates,
  onConfirm,
  onClose,
  mode = 'range',
  title = '요청 일자 설정'
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [selectionStep, setSelectionStep] = useState<SelectionStep>('start');
  const [weekdayFilter, setWeekdayFilter] = useState<boolean[]>([true, true, true, true, true, true, true]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // 단일 날짜 선택 모드일 때 초기 선택된 날짜 설정
  useEffect(() => {
    if (mode === 'single' && initialSelectedDates.length > 0) {
      setSelectedDates(new Set(initialSelectedDates));
    }
  }, [mode, initialSelectedDates]);

  // 시작일/종료일에 따라 현재 월 자동 설정
  useEffect(() => {
    if (selectionStep === 'start' && dateRange.start) {
      const startDate = new Date(dateRange.start);
      setCurrentMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    } else if (selectionStep === 'end' && dateRange.end) {
      const endDate = new Date(dateRange.end);
      setCurrentMonth(new Date(endDate.getFullYear(), endDate.getMonth(), 1));
    }
  }, [selectionStep, dateRange.start, dateRange.end]);

  // 로컬 날짜 문자열 생성 (YYYY-MM-DD 형식)
  const toLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDatesBetween = (startStr: string, endStr: string) => {
    const res: string[] = [];
    const start = new Date(startStr);
    const end = new Date(endStr);
    const cur = new Date(start);
    while (cur <= end) {
      res.push(toLocalDateString(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return res;
  };

  const handleDateSelection = (dateString: string) => {
    if (mode === 'single') {
      // 단일 날짜 선택 모드
      setSelectedDates(new Set([dateString]));
    } else {
      // 범위 선택 모드
      if (selectionStep === 'start') {
        setDateRange({ start: dateString, end: null });
        setSelectionStep('end');
      } else if (selectionStep === 'end') {
        if (!dateRange.start) return;
        if (dateString < dateRange.start) {
          setDateRange({ start: dateString, end: dateRange.start });
        } else {
          setDateRange(prev => ({ ...prev, end: dateString }));
        }
        setSelectionStep('weekday');
        
        // 요일 필터 단계 진입 시 전체 범위를 선택된 상태로 설정
        const startDate = dateString < dateRange.start ? dateString : dateRange.start;
        const endDate = dateString < dateRange.start ? dateRange.start : dateString;
        const allDates = getDatesBetween(startDate, endDate);
        setSelectedDates(new Set(allDates));
      }
    }
  };

  const handleStepClick = (step: SelectionStep) => {
    if (mode === 'single') {
      // 단일 날짜 선택 모드에서는 단계 변경 불가
      return;
    }
    
    if (step === 'start') {
      setSelectionStep('start');
    } else if (step === 'end' && dateRange.start) {
      setSelectionStep('end');
    } else if (step === 'weekday' && dateRange.start && dateRange.end) {
      setSelectionStep('weekday');
    }
  };

  const toggleWeekday = (index: number) => {
    if (mode === 'single') {
      // 단일 날짜 선택 모드에서는 요일 필터 사용 불가
      return;
    }
    
    setWeekdayFilter(prev => {
      const newFilter = [...prev];
      newFilter[index] = !newFilter[index];
      return newFilter;
    });
    
    // 요일 필터 토글 시 해당 요일의 모든 날짜를 selectedDates에서 토글
    if (dateRange.start && dateRange.end) {
      const allDates = getDatesBetween(dateRange.start, dateRange.end);
      const targetWeekdayDates = allDates.filter(date => {
        const dayOfWeek = new Date(date).getDay();
        return dayOfWeek === index;
      });
      
      setSelectedDates(prev => {
        const newSet = new Set(prev);
        const isCurrentlySelected = weekdayFilter[index];
        
        targetWeekdayDates.forEach(date => {
          if (isCurrentlySelected) {
            newSet.delete(date);
          } else {
            newSet.add(date);
          }
        });
        
        return newSet;
      });
    }
  };

  const toggleDate = (dateString: string) => {
    setSelectedDates(prev => {
      const newSet = new Set(prev);
      
      if (mode === 'single') {
        // 단일 날짜 선택 모드: 기존 선택을 모두 제거하고 새로운 날짜만 선택
        newSet.clear();
        newSet.add(dateString);
      } else {
        // 범위 선택 모드: 기존 로직 유지
        if (newSet.has(dateString)) {
          newSet.delete(dateString);
        } else {
          newSet.add(dateString);
        }
        
        // 개별 날짜 토글 후 해당 요일의 모든 날짜가 선택되었는지 확인
        if (dateRange.start && dateRange.end) {
          const dayOfWeek = new Date(dateString).getDay();
          const allDates = getDatesBetween(dateRange.start, dateRange.end);
          const targetWeekdayDates = allDates.filter(date => {
            const dateDayOfWeek = new Date(date).getDay();
            return dateDayOfWeek === dayOfWeek;
          });
          
          const allWeekdaySelected = targetWeekdayDates.every(date => newSet.has(date));
          
          setWeekdayFilter(prev => {
            const newFilter = [...prev];
            newFilter[dayOfWeek] = allWeekdaySelected;
            return newFilter;
          });
        }
      }
      
      return newSet;
    });
  };

  const handleConfirm = () => {
    if (mode === 'range' && (!dateRange.start || !dateRange.end)) {
      alert('시작일과 종료일을 선택해주세요.');
      return;
    }
    
    if (mode === 'single' && selectedDates.size === 0) {
      alert('날짜를 선택해주세요.');
      return;
    }
    
    const selectedDatesArray = Array.from(selectedDates);
    onConfirm(selectedDatesArray);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Dialog.Title className="flex items-center">{title}</Dialog.Title>
            <Button
              variant="ghost"
              size="2"
              onClick={handleClose}
              className="flex items-center gap-1 self-center -mt-4"
            >
              <X size={16} />
              <span className="text-sm font-medium">닫기</span>
            </Button>
          </Flex>

          <StepHeader
            selectionStep={selectionStep}
            dateRange={dateRange}
            selectedDates={selectedDates}
            onStepClick={handleStepClick}
            mode={mode}
          />

          <Calendar
            currentMonth={currentMonth}
            dateRange={dateRange}
            selectionStep={selectionStep}
            weekdayFilter={weekdayFilter}
            selectedDates={selectedDates}
            onMonthChange={setCurrentMonth}
            onDateSelection={handleDateSelection}
            onWeekdayToggle={toggleWeekday}
            onDateToggle={toggleDate}
            mode={mode}
          />

          <Flex gap="3" className="mt-4">
            <Button
              onClick={handleConfirm}
              disabled={mode === 'range' ? (!dateRange.start || !dateRange.end) : selectedDates.size === 0}
              className="flex-1"
            >
              확인
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
