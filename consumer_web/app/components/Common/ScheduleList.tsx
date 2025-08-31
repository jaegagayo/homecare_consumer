import { useNavigate } from "@remix-run/react";
import {
  Flex,
  Text,
  Badge
} from "@radix-ui/themes";
import {
  Clock,
  MapPin
} from "lucide-react";
import { formatTime, calculateDuration } from "../../utils/formatters";
import { ConsumerScheduleResponse } from "../../types/schedule";

interface ScheduleListProps {
  schedules: ConsumerScheduleResponse[];
  filterFunction?: (schedule: ConsumerScheduleResponse) => boolean;
  showStatus?: boolean;
  getStatusColor?: (status: string) => string;
  getStatusText?: (status: string) => string;
  onClickSchedule?: (scheduleId: string) => void;
  emptyMessage?: string;
}

export default function ScheduleList({
  schedules,
  filterFunction,
  showStatus = true,
  getStatusColor,
  getStatusText,
  onClickSchedule,
  emptyMessage = "일정이 없습니다."
}: ScheduleListProps) {
  const navigate = useNavigate();

  // 필터링된 일정들
  const filteredSchedules = filterFunction ? schedules.filter(filterFunction) : schedules;

  const handleScheduleClick = (scheduleId: string) => {
    if (onClickSchedule) {
      onClickSchedule(scheduleId);
    } else {
      // 기본 동작: 상세 페이지로 이동
      navigate(`/main/schedule-detail?id=${scheduleId}`);
    }
  };

  if (filteredSchedules.length === 0) {
    return (
      <div className="p-8 text-center">
        <Text color="gray">{emptyMessage}</Text>
      </div>
    );
  }

  return (
    <Flex direction="column" gap="3">
      {filteredSchedules.map((schedule) => {
        const timeInfo = { start: schedule.serviceStartTime, end: schedule.serviceEndTime };

        return (
          <div
            key={schedule.serviceMatchId}
            className={`p-4 ${onClickSchedule ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
            onClick={() => handleScheduleClick(schedule.serviceMatchId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleScheduleClick(schedule.serviceMatchId);
              }
            }}
            role={onClickSchedule ? 'button' : undefined}
            tabIndex={onClickSchedule ? 0 : undefined}
          >
            <Flex justify="between" align="center" gap="4">
              {/* 왼쪽: 시간 */}
              <div className="w-20">
                <Flex direction="column" gap="0">
                  <Text size="3" weight="medium" className="text-gray-900">
                    {timeInfo.start}
                  </Text>
                  <Text size="1" color="gray" className="text-xs">
                    (~ {timeInfo.end})
                  </Text>
                </Flex>
              </div>

              {/* 세로 구분선 */}
              <div className="w-px h-12 bg-gray-200"></div>

              {/* 중앙: 주요 정보 */}
              <Flex direction="column" gap="2" className="flex-1">
                {/* 요양보호사 이름과 상태 */}
                <Flex align="center" gap="3">
                  <Text size="3" weight="medium">{schedule.caregiverName} 님</Text>
                  {showStatus && (
                    <>
                      {getStatusColor && getStatusText ? (
                        <Badge
                          color={getStatusColor(schedule.matchStatus) as "blue" | "green" | "red" | "gray"}
                          className="text-xs"
                        >
                          {getStatusText(schedule.matchStatus)}
                        </Badge>
                      ) : (
                        <Badge color="blue" className="text-xs">
                          예정
                        </Badge>
                      )}
                    </>
                  )}
                  {schedule.isRegular && schedule.regularSequence && (
                    <Badge variant="soft" color="purple" className="text-xs">
                      {schedule.regularSequence.current}회차 (총 {schedule.regularSequence.total}회)
                    </Badge>
                  )}
                </Flex>

                {/* 주소와 소요 시간 - 세로 배치 */}
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="1">
                    <MapPin size={14} className="text-gray-500" />
                    <Text size="2" color="gray">{schedule.serviceAddress}</Text>
                  </Flex>
                  <Flex align="center" gap="1">
                    <Clock size={14} className="text-gray-500" />
                    <Text size="2" color="gray">{calculateDuration(`${schedule.serviceStartTime} - ${schedule.serviceEndTime}`)}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </div>
        );
      })}
    </Flex>
  );
}
