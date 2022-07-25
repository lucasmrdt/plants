import { useState } from "react";
import { useAtom } from "jotai";
import { Calendar } from "primereact/calendar";
import { timeRangeAtom } from "@/stores";

export function SelectTimeRange() {
  const [timeRange, setTimeRange] = useAtom(timeRangeAtom);

  const [localTimeRange, setLocalTimeRange] = useState([
    new Date(timeRange.start),
    timeRange.end ? new Date(timeRange.end) : undefined,
  ]);
  const value = localTimeRange as Date[];

  return (
    <Calendar
      id="range"
      value={localTimeRange as Date[]}
      onChange={(e) => setLocalTimeRange(e.value as Date[])}
      onHide={() =>
        setTimeRange({
          start: value[0].valueOf(),
          end: value[1]?.valueOf(),
        })
      }
      selectionMode="range"
      readOnlyInput
      showIcon
      dateFormat="dd/mm/y"
    />
  );
}
