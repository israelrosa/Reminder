import styled from 'styled-components/native';

interface Props {
  marginTop: number | undefined;
}

export const Container = styled.View<Props>`
  flex: 1;
  position: relative;
  background-color: #ffffff;
  margin-top: ${(props) => props.marginTop}px;
`;

export const Topics = styled.View`
  flex: 1;
  margin-top: 10px;
  min-height: 50px;
`;

export const TopicTitle = styled.Text`
  margin-left: 25px;
  margin-bottom: 10px;
  font-family: 'Poppins_600SemiBold';
  font-size: 18px;
`;

export const ButtonContainer = styled.View`
  padding: 5px;
  margin-top: 15px;
`;
