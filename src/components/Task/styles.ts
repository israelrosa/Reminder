import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

export const Container = styled(LinearGradient)`
  background-color: #fff;
  margin: 5px;
  border-radius: 30px;
  overflow: visible;
`;

export const Header = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const Title = styled.Text`
  color: ${(props) => props.theme.textPrimary};
  font-family: 'Poppins_600SemiBold';
  font-size: 18px;
`;

export const DateTime = styled.Text`
  color: ${(props) => props.theme.primary};
  font-family: 'Poppins_500Medium';
  font-size: 12px;
`;

export const Content = styled.View`
  flex: 1;
`;

export const Description = styled.Text`
  color: ${(props) => props.theme.secondary};
  font-family: 'Raleway_400Regular';
  font-size: 14px;
  margin-bottom: 5px;
`;
