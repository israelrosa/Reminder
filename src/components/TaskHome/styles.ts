import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: #fff;
  border-radius: 30px;
  flex-direction: row;
  overflow: hidden;
  max-height: 150px;
  margin-top: 15px;
`;

export const DateContainer = styled.View`
  background-color: blue;
  justify-content: center;
  align-items: center;
`;

export const DateText = styled.Text`
  color: white;
`;

export const Content = styled.View`
  flex: 1;
`;

export const Percentage = styled.View`
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  color: ${(props) => props.theme.textPrimary};
  font-family: 'Poppins_600SemiBold';
  font-size: 18px;
`;

export const Description = styled.Text`
  color: ${(props) => props.theme.secondary};
  font-family: 'Raleway_400Regular';
  font-size: 14px;
  margin-bottom: 5px;
`;

export const ProgressText = styled.Text`
  color: ${(props) => props.theme.primary};
  font-family: 'Poppins_500Medium';
  font-size: 18px;
`;
