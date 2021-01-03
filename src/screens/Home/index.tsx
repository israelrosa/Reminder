import React from 'react';
import { StatusBar as st } from 'react-native';
import {} from 'react-navigation-stack';

import Header from '../../components/Header';
import { Container } from './styles';

const Home: React.FC = () => {
  return (
    <Container marginTop={st.currentHeight}>
      <Header title="TODO" />
    </Container>
  );
};

export default Home;
