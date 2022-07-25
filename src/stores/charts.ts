import { atom } from "jotai";
import { loadable } from "jotai/utils";
import _ from "lodash";
import dayjs from "dayjs";
import { TimeRange } from "@/types";
import {
  fetchMoistureData,
  fetchOutsideHumidityData,
  fetchOutsidePressureData,
  fetchOutsideTemperatureData,
  fetchTemperatureData,
  fetchThresholdData,
  fetchWateringDurationData,
} from "@/api";
import { AVAILABLE_IDS } from "@/constants";

export const timeRangeAtom = atom<TimeRange>({ start: dayjs().valueOf() });

export const isTimeRangeOneDayAtom = atom(
  (get) => get(timeRangeAtom).end === undefined
);

export const selectedIdsAtom = atom<string[]>(AVAILABLE_IDS);

export const moistureDataByIdsAtom = loadable(
  atom(async (get) => {
    const timeRange = get(timeRangeAtom);
    const ids = get(selectedIdsAtom);
    const datas = await Promise.all(
      ids.map((id) => fetchMoistureData(id, timeRange))
    );
    return _.zipObject(ids, datas);
  })
);

export const temperatureDataByIdsAtom = loadable(
  atom(async (get) => {
    const timeRange = get(timeRangeAtom);
    const ids = get(selectedIdsAtom);
    const datas = await Promise.all(
      ids.map((id) => fetchTemperatureData(id, timeRange))
    );
    return _.zipObject(ids, datas);
  })
);

export const outsideHumidityAtom = loadable(
  atom(async (get) => {
    const timeRange = get(timeRangeAtom);
    return await fetchOutsideHumidityData(timeRange);
  })
);

export const outsideTemperatureAtom = loadable(
  atom(async (get) => {
    const timeRange = get(timeRangeAtom);
    return await fetchOutsideTemperatureData(timeRange);
  })
);

export const outsidePressureAtom = loadable(
  atom(async (get) => {
    const timeRange = get(timeRangeAtom);
    return await fetchOutsidePressureData(timeRange);
  })
);

export const thresholdAtom = loadable(
  atom(async () => {
    const data = await fetchThresholdData();
    if (data.length === 0) {
      throw new Error("No threshold available");
    }
    return data[data.length - 1].value;
  })
);

export const wateringDurationAtom = loadable(
  atom(async () => {
    const data = await fetchWateringDurationData();
    if (data.length === 0) {
      throw new Error("No watering duration available");
    }
    return data[data.length - 1].value;
  })
);
