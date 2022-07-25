import _ from "lodash";
import { useAtom } from "jotai";
import { isTimeRangeOneDayAtom, outsidePressureAtom } from "@/stores";
import { Loading, Error, Chart, Dataset } from "@/components";
import { usePrev } from "@/hooks";
import { toFixed } from "@/utils";
import { useMemo } from "react";

const format = (value: number) => `${toFixed(value, 1, false)} Pa`;

export function PressureChart() {
  const [pressureState] = useAtom(outsidePressureAtom);
  const [isOneDay] = useAtom(isTimeRangeOneDayAtom);

  const hasError = pressureState.state === "hasError";
  const hasData = pressureState.state === "hasData";

  const datasets = useMemo(
    () =>
      hasData
        ? [
            {
              data: pressureState.data,
              name: "Outside",
              color: "#bcb8b1",
              type: "area-spline",
            } as Dataset,
          ]
        : [],
    [hasData, pressureState]
  );
  const prevDatasets = usePrev(datasets, hasData);

  const isLoading =
    _.isEmpty(prevDatasets) && pressureState.state === "loading";

  if (hasError) {
    return <Error />;
  }
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Chart
      datasets={_.isEmpty(datasets) ? prevDatasets ?? [] : datasets}
      isSameDay={isOneDay}
      title="Moisture/Humidity"
      format={format}
      loading={!hasData}
    />
  );
}
