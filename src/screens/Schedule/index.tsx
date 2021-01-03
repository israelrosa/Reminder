import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { format, toDate } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { FlatList, StatusBar as st } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import CreateButton from '../../components/CreateButton';
import Header from '../../components/Header';
import Task from '../../components/Task';
import SchedulesController from '../../controller/SchedulesController';
import { dateInitialArgs, reducerDate } from '../../reducers/reducerDate';
import { Container } from './styles';

interface ToDos {
  done: number;
  description: string;
}

interface ScheduleContent {
  id: number;
  title: string;
  description: string;
  todos: ToDos[];
  timestamp: string;
  year: number;
  month: number;
  day: number;
}

type RootParamList = {
  Form: { data: ScheduleContent };
};

type RouteParams = RouteProp<RootParamList, 'Form'>;

const Schedule: React.FC = () => {
  const { navigate } = useNavigation();
  const [schedules, setSchedules] = useState<ScheduleContent[]>([]);
  const [datePicker, setDatePicker] = useState(false);
  const [date, dispatch] = useReducer(reducerDate, dateInitialArgs);
  const route = useRoute<RouteParams>();

  useEffect(() => {
    (async (): Promise<void> => {
      const data = await SchedulesController.showAll(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      );
      if (data) {
        const schedule = JSON.parse(data);
        // console.log(schedule);

        setSchedules(schedule);
      }
    })();
  }, [date]);

  useEffect(() => {
    const newSchedules = schedules.slice();
    if (
      route.params &&
      schedules.findIndex((schdl) => schdl.id === route.params.data.id) === -1
    ) {
      newSchedules.push(route.params.data);
      setSchedules(newSchedules);
    }
  }, [route.params]);
  const handleNavigate = useCallback(() => {
    navigate('ScheduleForm', { isSchedule: true });
  }, [navigate]);

  const handleChangeDate = (newDate: Date | undefined): void => {
    setDatePicker(false);
    if (newDate) {
      dispatch({ type: 'CHANGE_DATE', date: newDate });
    }
  };
  return (
    <Container marginTop={st.currentHeight}>
      <Header
        selection
        onPressDate={() => setDatePicker(true)}
        onPressBack={() => dispatch({ type: 'REDUCE_DAY' })}
        onPressForward={() => dispatch({ type: 'ADD_DAY' })}
        title={format(date, 'dd/MM')}
      />
      {datePicker && (
        <DateTimePicker
          value={date}
          style={{ flex: 1 }}
          onChange={(value, newDate) => handleChangeDate(newDate)}
        />
      )}
      <DraggableFlatList
        data={schedules}
        renderItem={({ item }) => (
          <Task
            title={item.title}
            date={format(new Date(toDate(Number(item.timestamp))), 'p')}
            isDisabled
            description={item.description}
            ToDoArrayData={item.todos}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 15, flex: 1 }}
      />
      <CreateButton onPress={handleNavigate} />
      <StatusBar backgroundColor="#7E84FF" style="light" />
    </Container>
  );
};

export default Schedule;
