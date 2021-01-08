/* eslint-disable @typescript-eslint/no-explicit-any */
import { useField } from '@unform/core';
import React, { useEffect, useRef } from 'react';
import { TextInputProps } from 'react-native';

import { theme } from '../../styles/theme';
import { Container } from './styles';

interface InputProps extends TextInputProps {
  name: string;
}

const Input: React.FC<InputProps> = ({ name, ...rest }) => {
  const inputRef = useRef<any>(null);

  const { defaultValue = '', fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container
      ref={inputRef}
      placeholderTextColor={theme.secondary}
      defaultValue={defaultValue}
      multiline
      onChangeText={(text) => {
        inputRef.current.value = text;
      }}
      {...rest}
    />
  );
};

export default Input;
