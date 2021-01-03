import React from 'react';
import { FlatList } from 'react-native';

import ToDo from '../ToDo';
import {
  Container,
  Title,
  TitleCard,
  DateTime,
  Content,
  Description,
} from './styles';

interface ToDoContent {
  done: number;
  description: string;
}

interface Props {
  title: string;
  date: string;
  isDisabled: boolean;
  description?: string;
  ToDoArrayData: ToDoContent[];
}

const Task: React.FC<Props> = ({
  description,
  date,
  title,
  isDisabled,
  ToDoArrayData,
}) => (
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
    <TitleCard>
      <Title>{title}</Title>
      <DateTime>{date}</DateTime>
    </TitleCard>
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
);
export default Task;
