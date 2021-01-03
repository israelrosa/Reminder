import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { GestureResponderEvent } from 'react-native';

import Input from '../Input';
import { Container, Content, Title } from './styles';

interface Props {
  title?: string;
  goBack?: boolean;
  selection?: boolean;
  edit?: boolean;
  isInput?: boolean;
  name?: string;
  navigationBack?: () => void;
  onPressBack?: ((event: GestureResponderEvent) => void) | undefined;
  onPressForward?: ((event: GestureResponderEvent) => void) | undefined;
  onPressDate?: ((event: GestureResponderEvent) => void) | undefined;
}

const Header: React.FC<Props> = ({
  title,
  edit,
  goBack,
  selection,
  navigationBack,
  name,
  isInput,
  onPressBack,
  onPressForward,
  onPressDate,
}) => {
  return (
    <Container>
      <LinearGradient
        colors={['#7E84FF', '#B6B9FF']}
        start={{ x: 0.0, y: 0.2 }}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <Content>
          {(goBack || edit) && navigationBack && (
            <Ionicons
              name="arrow-back"
              size={25}
              color="white"
              style={{ position: 'absolute', left: 25, top: 0 }}
              onPress={() => navigationBack()}
            />
          )}
          {selection && (
            <Ionicons
              name="chevron-back"
              color="white"
              size={25}
              onPress={onPressBack}
            />
          )}
          {isInput && name ? (
            <Input
              name={name}
              placeholder="Title"
              placeholderTextColor="white"
              style={{
                fontSize: 18,
                fontFamily: 'Poppins_700Bold',
                color: 'white',
                textAlign: 'center',
              }}
            />
          ) : (
            <Title onPress={onPressDate}>{title}</Title>
          )}

          {edit && (
            <Ionicons
              name="trash-outline"
              size={25}
              color="white"
              style={{ position: 'absolute', right: 25, top: 0 }}
            />
          )}
          {selection && (
            <Ionicons
              name="chevron-forward"
              color="white"
              size={25}
              onPress={onPressForward}
            />
          )}
        </Content>
      </LinearGradient>
    </Container>
  );
};

export default Header;
