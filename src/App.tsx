import styled from "styled-components";
import { Calendar } from "primereact/calendar";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import GraphSection from "./containers/GraphSection";
import { AVAILABLE_IDS } from "./constants";
import MenuSidebar from "./containers/MenuSidebar";

function App() {
  const [dateRangeValue, setDateRange] = useState<[Date, Date | undefined]>([
    dayjs().toDate(),
    undefined,
  ]);
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
      <Sticky>
        <FloatLeft>
          <Button
            icon="pi pi-th-large"
            onClick={() => setVisibleMenu(true)}
            className="mr-2"
          />
        </FloatLeft>
        <Calendar
          id="range"
          value={dateRange as Date[]}
          onChange={(e) =>
            // @ts-ignore
            setDateRange([e.value[0], e.value[1]])
          }
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

const FloatLeft = styled.div`
  position: absolute;
  left: 10px;
`;

export default App;
