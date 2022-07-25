import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import styled from "styled-components";
import { useAtom } from "jotai";
import AsyncButton from "@/components/AsyncButton";
import { wateringDurationAtom } from "@/stores";

const MAX_DURATION = 5 * 60; // 5 minutes

export function WateringEditor() {
  const [value, setValue] = useState<any>();
  const ref = useRef<OverlayPanel>(null);
  const [wateringState] = useAtom(wateringDurationAtom);

  const hasData = wateringState.state === "hasData";

  return (
    <>
      <Button
        label={hasData ? "Edit watering duration" : "loading..."}
        icon="pi pi-pencil"
        disabled={!hasData}
        onClick={(e) => {
          if (hasData) {
            setValue(wateringState.data);
            ref.current?.toggle(e);
          }
        }}
      />
      <OverlayPanel ref={ref}>
        <h5>Duration: {value}s</h5>
        <Space />
        <InputText
          value={value}
          onChange={(e) => setValue(e.target.value)}
          max={MAX_DURATION}
        />
        <Space />
        <Slider
          value={value}
          onChange={(e) => setValue(e.value)}
          max={MAX_DURATION}
        />
        <Space />
        <AsyncButton
          label="Save"
          onClick={async () => {
            if (hasData) {
              await new Promise((res) => setTimeout(res, 5000));
              setValue(wateringState.data);
            }
          }}
        />
      </OverlayPanel>
    </>
  );
}

const Space = styled.div`
  height: 10px;
  width: 10px;
`;
