import _ from "lodash";
import { useAtom } from "jotai";
import {
  isTimeRangeOneDayAtom,
  moistureDataByIdsAtom,
  outsideHumidityAtom,
  thresholdAtom,
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

const format = (value: number) => `${toFixed(value, 2)}%`;

export function MoistureChart() {
  const [moistureState] = useAtom(moistureDataByIdsAtom);
  const [outsideHumidityState] = useAtom(outsideHumidityAtom);
  const [thresholdState] = useAtom(thresholdAtom);
  const [isOneDay] = useAtom(isTimeRangeOneDayAtom);

  const hasError =
    moistureState.state === "hasError" ||
    thresholdState.state === "hasError" ||
    outsideHumidityState.state === "hasError";
  const hasData =
    moistureState.state === "hasData" &&
    thresholdState.state === "hasData" &&
    outsideHumidityState.state === "hasData";

  const data = useMemo(
    () =>
      hasData
        ? { ...moistureState.data, Outside: outsideHumidityState.data }
        : {},
    [hasData, moistureState, outsideHumidityState]
  );
  const dataset = useMemo(
    () =>
      _.map(data, (val, key) => ({
        data: val,
        name: key,
        color: COLORS[key],
        type: TYPES[key],
      })),
    [data]
  );
  const prevDataset = usePrev(dataset, hasData);

  const isLoading =
    (_.isEmpty(prevDataset) && moistureState.state === "loading") ||
    thresholdState.state === "loading";

  if (hasError) {
    return <Error />;
  }
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Chart
      datasets={_.isEmpty(dataset) ? _.values(prevDataset) : _.values(dataset)}
      isSameDay={isOneDay}
      title="Moisture/Humidity"
      format={format}
      threshold={thresholdState.data}
      min={10}
      loading={!hasData}
    />
  );
}
