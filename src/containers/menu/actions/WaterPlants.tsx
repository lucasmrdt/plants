import { useRef } from "react";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { AVAILABLE_IDS } from "@/constants";
import AsyncButton from "@/components/AsyncButton";

export function WaterPlants() {
  const ref = useRef<OverlayPanel>(null);

  return (
    <>
      <Button
        label="Water plant"
        icon="pi pi-play"
        onClick={(e) => ref.current?.toggle(e)}
      />
      <OverlayPanel ref={ref}>
        {AVAILABLE_IDS.map((id) => (
          <AsyncButton
            key={id}
            label={id}
            onClick={async () => {
              await new Promise((res) => setTimeout(res, 5000));
            }}
            className="p-button-text"
          />
        ))}
      </OverlayPanel>
    </>
  );
}
