import React from "react";
import { useAsync } from "react-async-hook";
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
import { Data } from "../types";
import { StatusProvider } from "../components/StatutProvider";
import { C3Type, Graph } from "../components/Graph";
import { useStore } from "../store";

const DataStatusProvider = StatusProvider<Data>;

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
      <DataStatusProvider asyncStates={[mstState, outHumState, thrState]}>
        {(mst, outHum) => (
          <Graph
            data={[...mst, outHum]}
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
        )}
      </DataStatusProvider>
      <Space />
      <DataStatusProvider asyncStates={[tmpState, outTmpState]}>
        {(tmp, outTmp) => (
          <Graph
            data={[...tmp, outTmp]}
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
        )}
      </DataStatusProvider>
      <Space />
      <StatusProvider asyncStates={[outPreState]}>
        {(outPre) => (
          <Graph
            data={outPre as Data}
            isSameDay={isSameDay}
            title="Pressure"
            name="Outside"
            format={(value) => `${toFixed(value, 1, false)} Pa`}
            type="area-spline"
            color="#bcb8b1"
          />
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
