import styled from "styled-components";
import { css } from "@emotion/css";
import { MoistureChart } from "./MoistureChart";
import { TemperatureChart } from "./TemperatureChart";
import { PressureChart } from "./PressureChart";

export function ChartContainer() {
  return (
    <div
      className={css`
        padding: 10px;
        margin-top: 30px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <MoistureChart />
      <Space />
      <TemperatureChart />
      <Space />
      <PressureChart />
    </div>
  );
}

const Space = styled.div`
  height: 40px;
`;
