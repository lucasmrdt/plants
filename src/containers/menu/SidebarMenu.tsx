import { Sidebar } from "primereact/sidebar";
import styled from "styled-components";
import { Informations } from "./Informations";
import { MoistureEditor } from "./actions/MoistureEditor";
import { WateringEditor } from "./actions/WateringEditor";
import { WaterPlants } from "./actions/WaterPlants";

interface Props {
  onHide: () => void;
  visible: boolean;
}

export function SidebarMenu({ onHide, visible }: Props) {
  return (
    <Sidebar visible={visible} onHide={onHide}>
      <MenuTitle>
        <i className="pi pi-info-circle"></i>
        <Space />
        <h2>Informations</h2>
      </MenuTitle>
      <Informations />
      <MenuTitle>
        <i className="pi pi-send"></i>
        <Space />
        <h2>Quick Actions</h2>
      </MenuTitle>
      <MoistureEditor />
      <Space />
      <WateringEditor />
      <Space />
      <WaterPlants />
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
