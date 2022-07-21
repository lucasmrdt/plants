import styled from "styled-components";
import { Calendar } from "primereact/calendar";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import GraphSection from "./GraphSection";
import { AVAILABLE_IDS } from "../constants";
import MenuSidebar from "./MenuSidebar";

function App() {
  const [range, setRange] = useState<[Date, Date | undefined]>([
    dayjs().toDate(),
    undefined,
  ]);
  const [dateRangeValue, setDataRangeValue] = useState(range);
  const [idsValue, setIds] = useState<string[]>(AVAILABLE_IDS);
  const [visibleMenu, setVisibleMenu] = useState(false);

  const dateRange = useMemo(
    () => (Array.isArray(dateRangeValue) ? dateRangeValue : [dateRangeValue]),
    [dateRangeValue]
  );
  const rangeFetch = useMemo(
    () => dateRange.map((d) => d?.valueOf()) as [number, number],
    [dateRange]
  );

  return (
    <Container>
      <MenuSidebar visible={visibleMenu} onHide={() => setVisibleMenu(false)} />
      <Float>
        <Button
          icon="pi pi-th-large"
          onClick={() => setVisibleMenu(true)}
          className="mr-2"
        />
      </Float>
      <Sticky>
        <Calendar
          id="range"
          value={range as Date[]}
          onChange={(e) =>
            // @ts-ignore
            setRange([e.value[0], e.value[1]])
          }
          onHide={() => setDataRangeValue(range)}
          selectionMode="range"
          readOnlyInput
          showIcon
          dateFormat="dd/mm/y"
          hideOnDateTimeSelect
        />
        <Space />
        <SelectButton
          value={idsValue}
          options={AVAILABLE_IDS.map((id) => ({
            label: id,
            value: id,
          }))}
          onChange={(e) => setIds(e.value)}
          optionLabel="label"
          multiple
        />
      </Sticky>
      <GraphSection rangeFetch={rangeFetch} ids={idsValue} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
`;

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

export default App;
