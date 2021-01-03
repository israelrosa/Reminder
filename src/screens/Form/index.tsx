import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form as FormView } from '@unform/mobile';
import { format } from 'date-fns';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, StatusBar as st, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import Button from '../../components/Button';
import Header from '../../components/Header';
import Input from '../../components/Input';
import ToDo from '../../components/ToDo';
import RemindersController from '../../controller/RemindersController';
import SchedulesController from '../../controller/SchedulesController';
import ToDoController from '../../controller/ToDoController';
import { theme } from '../../styles/theme';
import { ButtonContainer, Container, Topics, TopicTitle } from './styles';

type RootParams = {
  ScheduleForm: { isSchedule: boolean };
};

type RouteParamsProp = RouteProp<RootParams, 'ScheduleForm'>;

interface IToDo {
  done: number;
  description: string;
}

interface Data {
  title: string;
  description: string;
}

const Form: React.FC = () => {
  const [date, setDate] = useState(() => {
    const dateNow = new Date();

    const dateFormated = format(dateNow, 'yyyy-MM-dd');

    return dateFormated;
  });
  const [timePickerStatus, setTimePickerStatus] = useState(false);
  const [time, setTime] = useState(new Date());
  const [todos, setTodos] = useState<IToDo[]>([]);
  const [todoText, setTodoText] = useState('');
  const { goBack, navigate } = useNavigation();
  const route = useRoute<RouteParamsProp>();

  const formRef = useRef<FormHandles>(null);

  const createTodo = async (id: number, isSchedule: boolean): Promise<void> => {
    if (isSchedule && todos) {
      todos.forEach(async (todo) => {
        await ToDoController.create(Number(todo.done), todo.description, id);
      });
    } else {
      todos?.forEach(async (todo) => {
        await ToDoController.create(
          Number(todo.done),
          todo.description,
          undefined,
          id,
        );
      });
    }
  };
  const handleSubmit = async (data: Data): Promise<void> => {
    if (route.params.isSchedule) {
      const newDate = date.split(/-/g);
      const schedule = await SchedulesController.create(
        data.title,
        data.description,
        time.getTime().toString(),
        Number(newDate[0]),
        Number(newDate[1]),
        Number(newDate[2]),
      );

      if (schedule.id) {
        createTodo(schedule.id, true);
      }
      schedule.todos = todos;
      navigate('ScheduleContent', { data: schedule });
    } else {
      const dateNow = new Date();
      const reminder = await RemindersController.create(
        data.title,
        dateNow.getFullYear(),
        dateNow.getMonth() + 1,
        dateNow.getDate(),
        data.description,
      );

      if (reminder.id) {
        createTodo(reminder.id, false);
      }
      reminder.todos = todos;
      navigate('ReminderContent', { data: reminder });
    }
  };

  const handleToDoCreate = useCallback(() => {
    if (
      !todos ||
      (todos.findIndex((todo) => todo.description === todoText) === -1 &&
        todoText !== '')
    ) {
      setTodos(
        todos
          ? todos.concat([{ done: 0, description: todoText }])
          : [{ done: 0, description: todoText }],
      );
    }
  }, [todos, todoText]);

  const handleDeleteTodo = useCallback(
    (index) => {
      if (todos) {
        const newTodos = todos.slice();
        newTodos?.splice(index, 1);
        setTodos(newTodos);
      }
    },
    [todos],
  );

  const handleCheckTodo = (index: number): void => {
    if (todos) {
      const newTodos = todos.slice();
      if (newTodos[index].done) {
        newTodos[index].done = 0;
      } else {
        newTodos[index].done = 1;
      }
      setTodos(newTodos);
    }
  };

  const handleTimePicker = (newTime: Date | undefined): void => {
    setTimePickerStatus(false);
    if (newTime) {
      setTime(newTime);
    }
  };

  return (
    <Container marginTop={st.currentHeight}>
      <FormView onSubmit={handleSubmit} ref={formRef} style={{ flex: 1 }}>
        <Header goBack isInput name="title" navigationBack={goBack} />

        <FlatList
          ListHeaderComponent={
            <>
              <Topics>
                <TopicTitle>Description</TopicTitle>
                <Input
                  placeholder="Describe your task"
                  name="description"
                  style={{ marginLeft: 25 }}
                />
              </Topics>
              <TopicTitle style={{ marginTop: 10 }}>To Do</TopicTitle>
            </>
          }
          data={todos}
          renderItem={({ item, index }) => (
            <ToDo
              style={{ marginHorizontal: 25, marginBottom: 5 }}
              disabled={false}
              done={item.done}
              description={item.description}
              onPressDelete={() => handleDeleteTodo(index)}
              onPressCheckBox={() => handleCheckTodo(index)}
              close
            />
          )}
          keyExtractor={(item) => item.description}
          ListFooterComponent={
            <>
              <Input
                name="todo"
                placeholder="Your To Do"
                selectTextOnFocus
                style={{ marginLeft: 25 }}
                onChangeText={(text) => setTodoText(text)}
                onSubmitEditing={handleToDoCreate}
              />
              {route.params?.isSchedule && (
                <>
                  <Topics>
                    <TopicTitle>Date</TopicTitle>
                    <Calendar
                      onDayPress={(day) => setDate(day.dateString)}
                      minDate={new Date()}
                      markedDates={{ [date]: { selected: true } }}
                    />
                  </Topics>
                  <Topics>
                    <TopicTitle>Schedule</TopicTitle>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text
                        style={{
                          marginLeft: 25,
                          fontFamily: 'Raleway_400Regular',
                          fontSize: 18,
                          color: theme.black,
                        }}
                        onPress={() => setTimePickerStatus(true)}
                      >
                        {format(time, 'p')}
                      </Text>
                      <Ionicons
                        name="create-outline"
                        size={25}
                        style={{ marginLeft: 10 }}
                        color={theme.primary}
                        onPress={() => setTimePickerStatus(true)}
                      />
                    </View>
                    {timePickerStatus && (
                      <DateTimePicker
                        mode="time"
                        minuteInterval={5}
                        value={time}
                        onChange={(value, newTime) => handleTimePicker(newTime)}
                      />
                    )}
                  </Topics>
                  {/* <Topics>
                    <TopicTitle>Options</TopicTitle>
                  </Topics> */}
                  <ButtonContainer>
                    <Button onPress={() => formRef.current?.submitForm()}>
                      Done
                    </Button>
                  </ButtonContainer>
                </>
              )}
            </>
          }
        />
        {!route.params?.isSchedule && (
          <ButtonContainer>
            <Button onPress={() => formRef.current?.submitForm()}>Done</Button>
          </ButtonContainer>
        )}
      </FormView>
    </Container>
  );
};

export default Form;
