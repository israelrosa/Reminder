import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';

import { theme } from '../../styles/theme';
import ToDo from '../ToDo';
import {
  Container,
  Content,
  DateContainer,
  DateText,
  Percentage,
  ProgressText,
  Description,
  Title,
} from './styles';

interface ToDoContent {
  done: number;
  description: string;
}

interface Props {
  title: string;
  date: Date;
  isDisabled: boolean;
  description?: string;
  toDoArrayData: ToDoContent[];
}

const TaskHome: React.FC<Props> = ({
  toDoArrayData,
  date,
  isDisabled,
  title,
  description,
}) => {
  return (
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
        margin: 5,
      }}
    >
      <DateContainer>
        <LinearGradient
          colors={['#7E84FF', '#B6B9FF']}
          start={{ x: 0.0, y: 0.2 }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
            paddingHorizontal: 20,
          }}
        >
          <DateText
            style={{
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 18,
              marginBottom: -10,
            }}
          >
            TODAY
          </DateText>
          <DateText style={{ fontFamily: 'Poppins_600Medium', fontSize: 14 }}>
            {format(date, 'p')}
          </DateText>
        </LinearGradient>
      </DateContainer>
      <Content style={{ paddingVertical: 15, paddingHorizontal: 15 }}>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <FlatList
          data={toDoArrayData}
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
      <Percentage style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
        <ProgressCircle
          percent={30}
          radius={30}
          borderWidth={3}
          color={theme.primary}
          shadowColor="#f2f2f2"
          bgColor="#fff"
          containerStyle={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <ProgressText>30%</ProgressText>
        </ProgressCircle>
      </Percentage>
    </Container>
  );
};

export default TaskHome;
