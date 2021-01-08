import styled from 'styled-components/native';

interface Props {
  disabled: boolean;
  isDone: number;
}

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CheckBox = styled.View<Props>`
  width: ${(props) => (props.disabled ? '15px' : '20px')};
  height: ${(props) => (props.disabled ? '15px' : '20px')};
  border-radius: ${(props) => (props.disabled ? '20px' : '7px')};
  background-color: ${(props) =>
    props.isDone ? props.theme.primary : 'transparent'};
  border: solid 1px
    ${(props) => {
      if (props.isDone) {
        return props.theme.primary;
      }
      if (props.disabled) {
        return props.theme.secondary;
      }
      return props.theme.black;
    }};
`;

export const DescriptionText = styled.Text<Props>`
  font-family: 'Raleway_400Regular';
  font-size: 14px;
  flex: 1;
  margin-left: 10px;
  color: ${(props) =>
    props.disabled ? props.theme.secondary : props.theme.black};
`;
