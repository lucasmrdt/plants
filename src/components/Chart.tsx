import React from "react";
import _ from "lodash";
import * as c3 from "c3";
import * as d3 from "d3";
import { Data } from "@/types";
import { BREAKPOINT_PHONE_MAX_W } from "@/constants";
import C3Chart from "./C3Chart";
import { LoadingOverlay } from "./LoadingOverlay";
import { css } from "@emotion/css";

function clusterData(data: Data, nbClusterers: number) {
  nbClusterers = Math.min(nbClusterers, data.length);
  return _.chunk(data, Math.floor(data.length / nbClusterers)).map((chunk) => ({
    timestamp: _.mean(chunk.map((d) => d.timestamp)),
    value: _.mean(chunk.map((d) => d.value)),
  }));
}

function getMaxDisplayedItems() {
  return window.innerWidth < BREAKPOINT_PHONE_MAX_W
    ? 50
    : Number.MAX_SAFE_INTEGER;
}

export type DatasetType = c3.ChartConfiguration["data"]["type"];

export interface Dataset {
  data: Data;
  type: Required<DatasetType>;
  color: string;
  name: string;
}

interface Props {
  datasets: Dataset[];
  title?: string;
  maxDisplayedItems?: number;
  isSameDay?: boolean;
  threshold?: number;
  min?: number;
  max?: number;
  format?: (value: number) => string;
  loading?: boolean;
}

export const Chart = React.memo(function Chart({
  datasets,
  title,
  threshold,
  maxDisplayedItems = 100,
  isSameDay = false,
  min,
  max,
  format = (value: number) => value.toFixed(2),
  loading = false,
}: Props) {
  console.log("render", title);
  const nbClusterers = Math.min(maxDisplayedItems, getMaxDisplayedItems());
  const clusteredDatas = datasets.map(({ data }) =>
    clusterData(data, nbClusterers)
  );
  const xAxis =
    clusteredDatas.length > 0
      ? clusteredDatas[0].map(({ timestamp }) => timestamp)
      : [];

  const columns = datasets.map(
    ({ name }, i) =>
      [name, ...clusteredDatas[i].map(({ value }) => value)] as [
        string,
        ...number[]
      ]
  );

  const props: c3.ChartConfiguration = {
    title: {
      text: title,
    },
    data: {
      x: "x",
      columns: [["x", ...xAxis], ...columns],
      types: datasets.reduce(
        (acc, { name, type }) => ({ ...acc, [name]: type }),
        {}
      ),
      colors: datasets.reduce(
        (acc, { name, color }) => ({ ...acc, [name]: color }),
        {}
      ),
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
  };

  return (
    <div
      className={css`
        position: relative;
        width: 100%;
      `}
    >
      <C3Chart {...props} />
      {loading && <LoadingOverlay />}
    </div>
  );
},
_.isEqual);
