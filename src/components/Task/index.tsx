import React, { memo, useRef, useState } from 'react';
import { FlatList, PanResponder, Animated } from 'react-native';

import ToDo from '../ToDo';
import {
  Container,
  Title,
  Header,
  DateTime,
  Content,
  Description,
} from './styles';

interface ToDoContent {
  done: number;
  description: string;
}

interface Props {
  id: number;
  title: string;
  date: string;
  description?: string;
  ToDoArrayData: ToDoContent[];
  color: string;
  isDone?: boolean;
  handleTask: (id: number) => Promise<void>;
  handleNavigate: () => void;
}

const Task: React.FC<Props> = ({
  id,
  description,
  date,
  title,
  ToDoArrayData,
  handleTask,
  handleNavigate,
  color,
  isDone,
}) => {
  const pan = useRef(new Animated.Value(0)).current;
  const [transparency, setTransparency] = useState(0);

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
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 300 && gestureState.dx > 0) {
          pan.setValue(gestureState.dx - (gestureState.dx / 150) * 75);
          setTransparency(gestureState.dx / 150);
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: async (evt, gestureState) => {
        Animated.spring(pan, {
          toValue: 0,
          friction: 5,
          useNativeDriver: false,
        }).start();
        if (gestureState.dx > 150) {
          handleTask(id);
        }
        if (
          gestureState.dx < 5 &&
          gestureState.dx > -5 &&
          gestureState.dy < 5 &&
          gestureState.dy > -5
        ) {
          handleNavigate();
        }
        setTransparency(0);
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
      <Container
        colors={[color, '#fff']}
        locations={[0, 10]}
        start={{ x: 0, y: 0 }}
        end={{ x: isDone ? 0.1 : transparency, y: 0 }}
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
          {description !== '' && <Description>{description}</Description>}
          <FlatList
            data={ToDoArrayData}
            renderItem={({ item }) => (
              <ToDo
                done={item.done}
                disabled
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
export default memo(Task);
