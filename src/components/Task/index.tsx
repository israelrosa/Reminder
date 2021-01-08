import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { FlatList, PanResponder, Animated } from 'react-native';

import ToDo from '../ToDo';
import {
  Container,
  Title,
  Header,
  DateTime,
  Content,
  Description,
  DeleteContainer,
} from './styles';

interface ToDoContent {
  done: number;
  description: string;
}

interface Props {
  id: number;
  title: string;
  date: string;
  isDisabled: boolean;
  description?: string;
  ToDoArrayData: ToDoContent[];
  handleDeleteTask: (id: number) => Promise<void>;
}

const Task: React.FC<Props> = ({
  id,
  description,
  date,
  title,
  isDisabled,
  ToDoArrayData,
  handleDeleteTask,
}) => {
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        pan.setOffset(gestureState.dx);
      },
      onPanResponderMove: Animated.event([null, { dx: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: async (evt, gestureState) => {
        Animated.spring(pan, {
          toValue: 0,
          friction: 5,
          useNativeDriver: false,
        }).start();
        if (gestureState.dx > 75) {
          handleDeleteTask(id);
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    }),
  ).current;

  return (
    <Animated.View
      style={{ transform: [{ translateX: pan }], position: 'relative' }}
      {...panResponder.panHandlers}
    >
      <DeleteContainer style={{ transform: [{ translateY: -25 }] }}>
        <Ionicons name="close-circle-outline" size={40} color="red" />
      </DeleteContainer>
      <Container
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,

          elevation: 2,
          paddingHorizontal: 20,
          paddingVertical: 15,
          margin: 5,
          flex: 1,
        }}
      >
        <Header>
          <Title>{title}</Title>
          <DateTime>{date}</DateTime>
        </Header>
        <Content>
          <Description>{description}</Description>
          <FlatList
            data={ToDoArrayData}
            renderItem={({ item }) => (
              <ToDo
                done={item.done}
                disabled={isDisabled}
                description={item.description}
                close={false}
              />
            )}
            keyExtractor={(item) => item.description}
          />
        </Content>
      </Container>
    </Animated.View>
  );
};
export default Task;
