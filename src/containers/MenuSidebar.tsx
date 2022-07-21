import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import styled from "styled-components";
import { AVAILABLE_IDS } from "../constants";
import AsyncButton from "../components/AsyncButton";
import { fetchThresholdData, fetchWateringDurationData } from "../api";
import { useStore } from "../store";

function DisplayInformations() {
  const [threshold] = useStore("threshold");
  const [watering] = useStore("watering");

  return (
    <div>
      <Item>Threshold: {threshold}%</Item>
      <Space />
      <Item>Watering duration: {watering}s</Item>
    </div>
  );
}

function EditMoisture() {
  const [value, setValue] = useState<any>();
  const ref = useRef<OverlayPanel>(null);
  const [threshold, setThreshold] = useStore("threshold");

  useEffect(() => {
    fetchThresholdData();
  }, []);

  return (
    <>
      <Button
        label="Edit moisture threshold"
        icon="pi pi-pencil"
        onClick={(e) => {
          setValue(threshold);
          ref.current?.toggle(e);
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
            await new Promise((res) => setTimeout(res, 5000));
            setThreshold(value);
          }}
        />
      </OverlayPanel>
    </>
  );
}

function EditWatering() {
  const [value, setValue] = useState<any>();
  const ref = useRef<OverlayPanel>(null);
  const [watering, setWatering] = useStore("watering");

  useEffect(() => {
    fetchWateringDurationData();
  }, []);

  return (
    <>
      <Button
        label="Edit watering duration"
        icon="pi pi-pencil"
        onClick={(e) => {
          setValue(watering);
          ref.current?.toggle(e);
        }}
      />
      <OverlayPanel ref={ref}>
        <h5>Duration: {value}s</h5>
        <Space />
        <InputText value={value} onChange={(e) => setValue(e.target.value)} />
        <Space />
        <Slider value={value} onChange={(e) => setValue(e.value)} />
        <Space />
        <AsyncButton
          label="Save"
          onClick={async () => {
            await new Promise((res) => setTimeout(res, 5000));
            setWatering(value);
          }}
        />
      </OverlayPanel>
    </>
  );
}

function WaterPlant() {
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

interface Props {
  onHide: () => void;
  visible: boolean;
}

function MenuSidebar({ onHide, visible }: Props) {
  return (
    <Sidebar visible={visible} onHide={onHide}>
      <MenuTitle>
        <i className="pi pi-info-circle"></i>
        <Space />
        <h2>Informations</h2>
      </MenuTitle>
      <DisplayInformations />
      <MenuTitle>
        <i className="pi pi-send"></i>
        <Space />
        <h2>Quick Actions</h2>
      </MenuTitle>
      <EditMoisture />
      <Space />
      <EditWatering />
      <Space />
      <WaterPlant />
    </Sidebar>
  );
}

const Space = styled.div`
  height: 10px;
  width: 10px;
`;

const MenuTitle = styled.div`
  margin-top: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Item = styled.p`
  font-size: 24px;
`;

export default React.memo(MenuSidebar);
