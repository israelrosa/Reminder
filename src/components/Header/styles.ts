import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  height: 80px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  overflow: hidden;
  z-index: 2;
`;

export const Content = styled.View`
  flex-direction: row;
  width: 100%;
  height: auto;
  position: relative;
  padding: 0px 25px;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  width: 80%;
  color: white;
  font-size: 18px;
  text-align: center;
  font-family: 'Poppins_700Bold';
  background-color: transparent;
`;
