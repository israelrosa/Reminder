import styled from 'styled-components/native';

interface Props {
  marginTop: number | undefined;
}

export const Container = styled.View<Props>`
  flex: 1;
  background-color: #ffffff;
  margin-top: ${(props) => props.marginTop}px;
`;
