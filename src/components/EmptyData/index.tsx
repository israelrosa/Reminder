import React from 'react';
import { Image } from 'react-native';

import { Container, MessageNotFound } from './styles';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const notFound = require('../../../assets/not-found.png');

const EmptyData: React.FC = ({ children }) => {
  return (
    <Container>
      <Image
        source={notFound}
        resizeMode="contain"
        style={{ width: '100%', height: 300 }}
      />
      <MessageNotFound>{children}</MessageNotFound>
    </Container>
  );
};

export default EmptyData;
