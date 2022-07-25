import styled from "styled-components";
import { ChartContainer } from "./charts/ChartsContainer";
import Menu from "./menu/Menu";

function App() {
  return (
    <Container>
      <Menu />
      <ChartContainer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
`;

export default App;
