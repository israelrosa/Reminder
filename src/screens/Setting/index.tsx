import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StatusBar as st } from 'react-native';

import Header from '../../components/Header';
import { Container } from './styles';

const Setting: React.FC = () => {
  return (
    <Container marginTop={st.currentHeight}>
      <Header title="Settings" />
      <StatusBar backgroundColor="#7E84FF" style="light" />
    </Container>
  );
};

export default Setting;
