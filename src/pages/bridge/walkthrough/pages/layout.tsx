import styled from "@emotion/styled";

const BaseStyled = styled.div`
  background-color: black;
  height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .row {
    width: min-content;
    display: flex;
    gap: 2rem;
  }
  section {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: center;
  }

  footer {
    margin-bottom: 2rem;
  }
`;

export default BaseStyled;