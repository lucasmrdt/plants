import _ from "lodash";
import * as c3 from "c3";
import * as d3 from "d3";
import { useEffect } from "react";
import styled from "styled-components";
import { Data } from "../types";
import { useWindowWidth } from "@react-hook/window-size";
import { BREAKPOINT_PHONE_MAX_W } from "../constants";

function clusterData(data: Data, nbClusterers: number) {
  nbClusterers = Math.min(nbClusterers, data.length);
  return _.chunk(data, Math.floor(data.length / nbClusterers)).map((chunk) => ({
    timestamp: _.mean(chunk.map((d) => d.timestamp)),
    value: _.mean(chunk.map((d) => d.value)),
  }));
}

function getMaxDisplayedItems(windowWidth: number, defaultValue: number) {
  return windowWidth < BREAKPOINT_PHONE_MAX_W ? 50 : defaultValue;
}

export type C3Type = c3.ChartConfiguration["data"]["type"];

interface Props {
  data: Data | Data[];
  name: string | string[];
  title?: string;
  maxDisplayedItems?: number;
  isSameDay?: boolean;
  type?: C3Type | C3Type[];
  threshold?: number;
  min?: number;
  max?: number;
  format?: (value: number) => string;
  color?: string | string[];
}

export const Graph = ({
  data: _data,
  name: _name,
  color: _color,
  title,
  threshold,
  maxDisplayedItems = 200,
  isSameDay = false,
  type: _type = "spline",
  min,
  max,
  format = (value: number) => value.toFixed(2),
}: Props) => {
  const windowWidth = useWindowWidth();

  const datas = (Array.isArray(_data[0]) ? _data : [_data]) as Data[];
  const names = (Array.isArray(_name) ? _name : [_name]) as string[];
  const colors = (Array.isArray(_color) ? _color : [_color]) as string[];
  const types = (Array.isArray(_type) ? _type : [_type]) as C3Type[];
  const id = title?.replace(/[^a-zA-Z0-9]/, "") || names.join("-");

  maxDisplayedItems = getMaxDisplayedItems(windowWidth, maxDisplayedItems);
  min = min ?? _.min(datas.map((d) => _.min(d.map(({ value }) => value)))) ?? 0;
  max = max ?? _.max(datas.map((d) => _.max(d.map(({ value }) => value)))) ?? 0;

  const clusteredDatas = datas.map((data) =>
    clusterData(data, maxDisplayedItems)
  );

  useEffect(() => {
    const chart = c3.generate({
      bindto: `#${id}`,
      title: {
        text: title,
      },
      data: {
        x: "x",
        columns: [
          ["x", ...clusteredDatas[0].map(({ timestamp }) => timestamp)],
          ...(clusteredDatas.map((clusteredData, i) => [
            names[i] || `y${i}`,
            ...clusteredData.map(({ value }) => value),
          ]) as [string, number][]),
        ],
        type: types[0],
        types:
          types.length > 0
            ? types.reduce(
                (acc, t, i) => ({ ...acc, [names[i] || `y${i}`]: t }),
                {}
              )
            : undefined,
        colors:
          colors.length > 0
            ? colors.reduce(
                (acc, c, i) => ({ ...acc, [names[i] || `y${i}`]: c }),
                {}
              )
            : undefined,
      },
      axis: {
        x: {
          type: "timeseries",
          tick: {
            format: isSameDay ? "%H:%M" : "%d/%m/%y",
            rotate: -45,
          },
        },
        y: { min, max, tick: { format } },
      },
      tooltip: {
        format: {
          title: (d) => d3.timeFormat("%d/%m/%y %H:%M")(d as Date),
          value: (value) => format(value as number),
        },
      },
      grid: {
        y: {
          lines: threshold ? [{ value: threshold, text: "" }] : [],
        },
      },
    });
    return () => {
      chart.destroy();
    };
  });

  return <Chart id={id} />;
};

const Chart = styled.div`
  transform: translateX(-15px);
  width: calc(100% + 15px);
`;
