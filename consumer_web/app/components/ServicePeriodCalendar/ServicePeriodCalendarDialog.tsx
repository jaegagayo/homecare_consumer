import { useState, useEffect } from "react";
import { Flex, Button, Dialog } from "@radix-ui/themes";
import { X } from "lucide-react";
import { ServicePeriodCalendarProps } from "../../types";
import CalendarView from "./CalendarView";

export default function ServicePeriodCalendarDialog({
  open,
  onOpenChange,
  requestedDates,
  title = "요청 날짜 상세보기"
}: ServicePeriodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 다이얼로그가 열릴 때 요청 날짜가 있는 월로 이동
  useEffect(() => {
    if (open && requestedDates.length > 0) {
      const firstRequestedDate = new Date(requestedDates[0]);
      setCurrentMonth(new Date(firstRequestedDate.getFullYear(), firstRequestedDate.getMonth(), 1));
    }
  }, [open, requestedDates]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Dialog.Title className="flex items-center">{title}</Dialog.Title>
            <Button
              variant="ghost"
              size="2"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-1 self-center -mt-4"
            >
              <X size={16} />
              <span className="text-sm font-medium">닫기</span>
            </Button>
          </Flex>
          
          <CalendarView
            currentMonth={currentMonth}
            requestedDates={requestedDates}
            onMonthChange={setCurrentMonth}
          />

          <Flex gap="3" className="mt-4">
            <Button 
              onClick={() => onOpenChange(false)}
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
