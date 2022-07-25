import _ from "lodash";
import { useAtom } from "jotai";
import {
  isTimeRangeOneDayAtom,
  outsideTemperatureAtom,
  temperatureDataByIdsAtom,
} from "@/stores";
import { Loading, Error, Chart, DatasetType } from "@/components";
import { usePrev } from "@/hooks";
import { generateColors, toFixed } from "@/utils";
import { AVAILABLE_IDS } from "@/constants";
import { useMemo } from "react";

const COLORS: { [key: string]: string } = {
  ..._.zipObject(
    AVAILABLE_IDS,
    generateColors("#03045e", "#00b4d8", AVAILABLE_IDS.length)
  ),
  Outside: "#bdd5ea",
};

const TYPES: { [key: string]: DatasetType } = {
  ..._.zipObject(
    AVAILABLE_IDS,
    _.times(AVAILABLE_IDS.length, () => "spline")
  ),
  Outside: "area-spline",
};

const format = (value: number) => `${toFixed(value, 2)}°C`;

export function TemperatureChart() {
  const [temperatureState] = useAtom(temperatureDataByIdsAtom);
  const [outsideTemperatureState] = useAtom(outsideTemperatureAtom);
  const [isOneDay] = useAtom(isTimeRangeOneDayAtom);

  const hasError =
    temperatureState.state === "hasError" ||
    outsideTemperatureState.state === "hasError";
  const hasData =
    temperatureState.state === "hasData" &&
    outsideTemperatureState.state === "hasData";

  const data = useMemo(
    () =>
      hasData
        ? { ...temperatureState.data, Outside: outsideTemperatureState.data }
        : {},
    [hasData, outsideTemperatureState, temperatureState]
  );
  const datasets = useMemo(
    () =>
      _.map(data, (val, key) => ({
        data: val,
        name: key,
        color: COLORS[key],
        type: TYPES[key],
      })),
    [data]
  );
  const prevDatasets = usePrev(datasets, hasData);

  const isLoading =
    _.isEmpty(prevDatasets) && temperatureState.state === "loading";

  if (hasError) {
    return <Error />;
  }
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Chart
      datasets={
        _.isEmpty(datasets) ? _.values(prevDatasets) : _.values(datasets)
      }
      isSameDay={isOneDay}
      title="Temperature"
      format={format}
      loading={!hasData}
    />
  );
}
