import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { GestureResponderEvent, ViewProps } from 'react-native';

import { theme } from '../../styles/theme';
import { CheckBox, Container, DescriptionText } from './styles';

interface ToDoContent extends ViewProps {
  disabled: boolean;
  done: number;
  description: string;
  close: boolean;
  onPressDelete?: ((event: GestureResponderEvent) => void) | undefined;
  onPressCheckBox?: ((event: GestureResponderEvent) => void) | undefined;
}

const ToDo: React.FC<ToDoContent> = ({
  disabled,
  done,
  description,
  close,
  onPressDelete,
  onPressCheckBox,
  ...rest
}) => {
  return (
    <Container {...rest}>
      <CheckBox
        isDone={done}
        disabled={disabled}
        onTouchStart={onPressCheckBox}
      />
      <DescriptionText isDone={done} disabled={disabled}>
        {description}
      </DescriptionText>

      {close && (
        <Ionicons
          name="close"
          size={25}
          color={theme.primary}
          onPress={onPressDelete}
        />
      )}
    </Container>
  );
};

export default ToDo;
