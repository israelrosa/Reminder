import styled from 'styled-components/native';

interface Props {
  marginTop: number | undefined;
}

export const Container = styled.View<Props>`
  flex: 1;
  background-color: #ffffff;
  margin-top: ${(props) => props.marginTop}px;
`;

export const ScheduleContainer = styled.View`
  flex: 1;
  background-color: white;
  min-height: 80px;
`;

export const ScheduleHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 30px;
  overflow: visible;
`;

export const ScheduleTitle = styled.Text`
  color: ${(props) => props.theme.primary};
  font-family: 'Poppins_600SemiBold';
  font-size: 18px;
`;

export const ScheduleTime = styled.Text`
  color: ${(props) => props.theme.primary};
  font-family: 'Poppins_500Medium';
  font-size: 12px;
`;

export const ScheduleDescription = styled.Text`
  color: ${(props) => props.theme.secondary};
  font-family: 'Raleway_400Regular';
  font-size: 14px;
  margin-bottom: 5px;
`;
