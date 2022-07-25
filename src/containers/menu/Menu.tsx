import styled from "styled-components";
import { Button } from "primereact/button";
import { useState } from "react";
import { TopMenu } from "./TopMenu";
import { SidebarMenu } from "./SidebarMenu";

function Menu() {
  const [visibleMenu, setVisibleMenu] = useState(false);

  return (
    <>
      <SidebarMenu visible={visibleMenu} onHide={() => setVisibleMenu(false)} />
      <Float>
        <Button
          icon="pi pi-th-large"
          onClick={() => setVisibleMenu(true)}
          className="mr-2"
        />
      </Float>
      <TopMenu />
    </>
  );
}

const Float = styled.div`
  position: fixed;
  z-index: 2;
  left: 10px;
  top: 10px;

  @media (max-width: 768px) {
    top: unset;
    bottom: 10px;
  }
`;

export default Menu;
