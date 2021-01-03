import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled(RectButton)`
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: ${(props) => props.theme.primary};
  position: absolute;
  right: 25px;
  bottom: 15px;
  border-radius: 200px;
`;
