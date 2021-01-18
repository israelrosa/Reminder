import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import PercentageCircle from 'react-native-progress-circle';

import { theme } from '../../styles/theme';
import Input from '../Input';
import { Container, Content, Title, TitlePercentage } from './styles';

interface Props {
  title?: string;
  goBack?: boolean;
  edit?: boolean;
  percentage?: number;
  isInput?: boolean;
  defaultValue?: string;
  name?: string;
  navigationBack?: () => void;
}

const Header: React.FC<Props> = ({
  title,
  edit,
  goBack,
  percentage,
  navigationBack,
  name,
  isInput,
  defaultValue,
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
              style={{
                position: 'absolute',
                left: 25,
                top: '50%',
                transform: [{ translateY: -17 }],
              }}
              onPress={() => navigationBack()}
            />
          )}
          {isInput && name && (
            <Input
              name={name}
              placeholder="Title"
              placeholderTextColor="white"
              style={{
                fontSize: 18,
                fontFamily: 'Poppins_700Bold',
                color: 'white',
                textAlign: 'center',
                maxWidth: 250,
              }}
              defaultValue={defaultValue ?? ''}
            />
          )}

          {title && <Title>{title}</Title>}

          {percentage && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PercentageCircle
                percent={percentage > 100 ? 1 : percentage}
                radius={25}
                borderWidth={4}
                shadowColor={theme.primary}
                bgColor={theme.primary}
                containerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Title>{`${percentage > 100 ? 0 : percentage}%`}</Title>
              </PercentageCircle>
              <TitlePercentage>Tasks Done</TitlePercentage>
            </View>
          )}

          {edit && (
            <Ionicons
              name="trash-outline"
              size={25}
              color="white"
              style={{ position: 'absolute', right: 25, top: 0 }}
            />
          )}
        </Content>
      </LinearGradient>
    </Container>
  );
};

export default Header;
