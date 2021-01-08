import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

interface Props {
  marginTop: number | undefined;
}

export const Container = styled.View<Props>`
  flex: 1;
  background-color: #ffffff;
  margin-top: ${(props) => props.marginTop}px;
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

export const Topics = styled.Text`
  font-family: 'Poppins_700Bold';
  color: ${(props) => props.theme.primary};
  font-size: 18px;
  margin-left: 25px;
`;

export const ReminderContainer = styled.View`
  background-color: #fff;
  margin: 5px;
  border-radius: 30px;
  overflow: visible;
  max-width: 250px;
`;

export const ReminderTitle = styled.Text`
  color: ${(props) => props.theme.textPrimary};
  font-family: 'Poppins_600SemiBold';
  font-size: 18px;
`;

export const ReminderDescription = styled.Text`
  color: ${(props) => props.theme.secondary};
  font-family: 'Raleway_400Regular';
  flex-wrap: wrap;
  font-size: 14px;
  margin-bottom: 5px;
`;

export const CalendarContainer = styled(LinearGradient)`
  flex: 1;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  overflow: hidden;
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
