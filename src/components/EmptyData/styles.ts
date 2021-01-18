import styled from 'styled-components/native';

export const Container = styled.View`
  align-items: center;
`;

export const MessageNotFound = styled.Text`
  color: ${(props) => props.theme.secondary};
  font-family: 'Raleway_400Regular';
  font-size: 14px;
`;
