import styled from "styled-components";
import { SelectTimeRange } from "./SelectTimeRange";
import { SelectIds } from "./SelectIds";

export function TopMenu() {
  return (
    <Sticky>
      <SelectTimeRange />
      <Space />
      <SelectIds />
    </Sticky>
  );
}

const Sticky = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: white;
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Space = styled.div`
  height: 10px;
  width: 10px;
`;
