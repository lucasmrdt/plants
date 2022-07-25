import { useEffect, useRef } from "react";
import * as c3 from "c3";
import { css } from "@emotion/css";
import { Loading } from "./Loading";

function extractColumnNames(data: c3.ChartConfiguration["data"]) {
  return data.columns?.map(([name]) => name) ?? [];
}

export default function C3Chart(props: c3.ChartConfiguration) {
  const { data } = props;

  const el = useRef<HTMLDivElement>(null);
  const chart = useRef<c3.ChartAPI>();
  const prevColNames = useRef(extractColumnNames(data));

  useEffect(() => {
    if (!chart.current) {
      return;
    }
    const colNames = extractColumnNames(data);
    const colNamesToUnload = prevColNames.current.filter(
      (name) => !colNames?.includes(name)
    );
    chart.current.load({
      columns: data.columns,
      unload: colNamesToUnload,
    });
    prevColNames.current = colNames;
  }, [data, props]);

  useEffect(() => {
    if (el.current && !chart.current) {
      chart.current = c3.generate({
        bindto: el.current,
        ...props,
        data,
      });
    }
    return () => {
      chart.current?.destroy();
      chart.current = undefined;
    };
    // onMount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={el}
      className={css`
        transform: translateX(-15px);
        width: calc(100% + 15px);
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Loading />
    </div>
  );
}
