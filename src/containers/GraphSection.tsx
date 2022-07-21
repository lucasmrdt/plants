import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import chroma from "chroma-js";
import {
  fetchMoistureData,
  fetchOutsideHumidityData,
  fetchOutsidePressureData,
  fetchOutsideTemperatureData,
  fetchTemperatureData,
  fetchThresholdData,
} from "../api";
import { StatusProvider } from "../components/StatutProvider";
import { C3Type, Graph } from "../components/Graph";
import { useAsync } from "../hooks";
import { useStore } from "../store";
import { Data } from "../types";
import { Loader } from "../components/Loader";

const DataStatusProvider = StatusProvider<Data | Data[] | null>;

function toFixed(value: number, precision: number, removeZeros = true) {
  const res = value.toFixed(precision);
  return removeZeros ? res.replace(/\.?0+$/, "") : res;
}

interface Props {
  rangeFetch: [number, number | undefined];
  ids: string[];
}

function GraphSection({ rangeFetch, ids }: Props) {
  const mstState = useAsync(fetchMoistureData, [ids, ...rangeFetch]);
  const outHumState = useAsync(fetchOutsideHumidityData, rangeFetch);
  const tmpState = useAsync(fetchTemperatureData, [ids, ...rangeFetch]);
  const outTmpState = useAsync(fetchOutsideTemperatureData, rangeFetch);
  const thrState = useAsync(fetchThresholdData, []);
  const outPreState = useAsync(fetchOutsidePressureData, rangeFetch);
  const [threshold] = useStore("threshold");

  const isSameDay = dayjs(rangeFetch[0]).isSame(rangeFetch[1], "day");

  return (
    <Container>
      <DataStatusProvider
        asyncStates={[mstState, outHumState, thrState]}
        backgroundLoading
      >
        {([mst, outHum], states) => (
          <div style={{ position: "relative" }}>
            {states.some((state) => state.refreshing) && <Loader />}
            <Graph
              data={[...mst, outHum] as Data[]}
              isSameDay={isSameDay}
              title="Moisture/Humidity"
              name={[...ids, "Outside"]}
              format={(value) => `${toFixed(value, 2)}%`}
              type={[...ids.map((_) => "spline" as C3Type), "area-spline"]}
              color={[
                ...(ids.length > 0
                  ? chroma
                      .scale(["#03045e", "#00b4d8"])
                      .mode("rgb")
                      .colors(ids.length)
                  : []),
                "#bdd5ea",
              ]}
              threshold={threshold}
              min={10}
            />
          </div>
        )}
      </DataStatusProvider>
      <Space />
      <DataStatusProvider
        asyncStates={[tmpState, outTmpState]}
        backgroundLoading
      >
        {([tmp, outTmp], states) => (
          <div style={{ position: "relative" }}>
            {states.some((state) => state.refreshing) && <Loader />}
            <Graph
              data={[...tmp, outTmp] as Data[]}
              isSameDay={isSameDay}
              title="Temperature"
              name={[...ids, "Outside"]}
              format={(value) => `${toFixed(value, 2)}°C`}
              type={[...ids.map((_) => "spline" as C3Type), "area-spline"]}
              color={[
                ...(ids.length > 0
                  ? chroma
                      .scale(["#660708", "#e5383b"])
                      .mode("rgb")
                      .colors(ids.length)
                  : []),
                "#fec89a",
              ]}
            />
          </div>
        )}
      </DataStatusProvider>
      <Space />
      <StatusProvider asyncStates={[outPreState]} backgroundLoading>
        {([outPre], states) => (
          <div style={{ position: "relative" }}>
            {states.some((state) => state.refreshing) && <Loader />}
            <Graph
              data={outPre as Data}
              isSameDay={isSameDay}
              title="Pressure"
              name="Outside"
              format={(value) => `${toFixed(value, 1)} Pa`}
              type="area-spline"
              color="#bcb8b1"
            />
          </div>
        )}
      </StatusProvider>
    </Container>
  );
}

const Container = styled.div`
  padding: 10px;
  margin-top: 30px;
  width: 100%;
`;

const Space = styled.div`
  height: 40px;
`;

export default React.memo(GraphSection);
