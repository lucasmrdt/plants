import styled from "styled-components";
import { useAtom } from "jotai";
import { thresholdAtom, wateringDurationAtom } from "@/stores";

export function Informations() {
  const [thresholdState] = useAtom(thresholdAtom);
  const [wateringState] = useAtom(wateringDurationAtom);

  const threshold =
    thresholdState.state === "hasData"
      ? `${thresholdState.data}%`
      : "loading...";
  const watering =
    wateringState.state === "hasData" ? `${wateringState.data}s` : "loading...";

  return (
    <div>
      <Text>Threshold: {threshold}</Text>
      <Space />
      <Text>Watering duration: {watering}</Text>
    </div>
  );
}

const Text = styled.p`
  font-size: 24px;
`;

const Space = styled.div`
  height: 10px;
  width: 10px;
`;
