import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled(RectButton)`
  width: 100%;
  height: 60px;
  border-radius: 30px;
  background-color: ${(props) => props.theme.primary};
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-family: 'Poppins_600SemiBold';
  font-size: 18px;
  color: white;
`;
