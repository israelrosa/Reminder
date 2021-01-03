import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container } from './styles';

const CreateButton: React.FC<RectButtonProperties> = ({ ...rest }) => {
  return (
    <Container
      {...rest}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
      }}
    >
      <Ionicons name="add" size={30} color="white" />
    </Container>
  );
};

export default CreateButton;
