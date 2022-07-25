import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import styled from "styled-components";
import { useAtom } from "jotai";
import AsyncButton from "@/components/AsyncButton";
import { thresholdAtom } from "@/stores";

export function MoistureEditor() {
  const [value, setValue] = useState<any>();
  const ref = useRef<OverlayPanel>(null);
  const [thresholdState] = useAtom(thresholdAtom);

  const hasData = thresholdState.state === "hasData";

  return (
    <>
      <Button
        label={hasData ? "Edit moisture threshold" : "loading..."}
        icon="pi pi-pencil"
        disabled={!hasData}
        onClick={(e) => {
          if (hasData) {
            setValue(thresholdState.data);
            ref.current?.toggle(e);
          }
        }}
      />
      <OverlayPanel ref={ref}>
        <h5>Threshold: {value}</h5>
        <Space />
        <InputText value={value} onChange={(e) => setValue(e.target.value)} />
        <Space />
        <Slider value={value} onChange={(e) => setValue(e.value)} />
        <Space />
        <AsyncButton
          label="Save"
          onClick={async () => {
            if (hasData) {
              await new Promise((res) => setTimeout(res, 5000));
              setValue(thresholdState.data);
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
