import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form as FormView } from '@unform/mobile';
import { format, toDate } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StatusBar as st, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as yup from 'yup';

import Button from '../../components/Button';
import Header from '../../components/Header';
import Input from '../../components/Input';
import ToDo from '../../components/ToDo';
import RemindersController from '../../controller/RemindersController';
import SchedulesController from '../../controller/SchedulesController';
import ToDoController from '../../controller/ToDoController';
import IReminder from '../../models/Reminder/interface';
import ISchedule from '../../models/Schedule/interface';
import IToDos from '../../models/ToDo/interface';
import { theme } from '../../styles/theme';
import getValidationErrors from '../../utils/getValidationErrors';
import { ButtonContainer, Container, Topics, TopicTitle } from './styles';

type RootParams = {
  ScheduleForm: { isSchedule: boolean; date: string };
  ScheduleTask: { scheduleId: number };
  ReminderTask: { reminderId: number };
};

type RouteParamsIsSchedule = RouteProp<RootParams, 'ScheduleForm'>;

type RouteParamsScheduleTask = RouteProp<RootParams, 'ScheduleTask'>;

type RouteParamsReminderTask = RouteProp<RootParams, 'ReminderTask'>;

interface Data {
  title: string;
  description: string;
}

const Form: React.FC = () => {
  const [date, setDate] = useState(() => {
    return format(new Date(), 'yyyy-MM-dd');
  });
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(false);
  const [timePickerStatus, setTimePickerStatus] = useState(false);
  const [time, setTime] = useState(new Date());
  const [todos, setTodos] = useState<IToDos[]>([]);
  const [delTodos, setDelTodos] = useState<number[]>([]);
  const [updateTodos, setUpdateTodos] = useState<number[]>([]);
  const [reminder, setReminder] = useState<IReminder>();
  const [schedule, setSchedule] = useState<ISchedule>();
  const [todoText, setTodoText] = useState('');
  const { goBack, navigate } = useNavigation();
  const routeIsSchedule = useRoute<RouteParamsIsSchedule>();
  const routeSchedule = useRoute<RouteParamsScheduleTask>();
  const routeReminder = useRoute<RouteParamsReminderTask>();

  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    if (routeIsSchedule.params?.date) {
      setDate(routeIsSchedule.params.date);
    }
    (async () => {
      if (routeReminder.params?.reminderId) {
        setIsEdit(true);
        const newReminder = await RemindersController.showOne(
          routeReminder.params.reminderId,
        );
        const reminderParsed: IReminder = JSON.parse(newReminder);
        setTodos(reminderParsed.todos);
        setReminder(reminderParsed);
      } else if (routeSchedule.params?.scheduleId) {
        setIsEdit(true);
        const newSchedule = await SchedulesController.showOne(
          routeSchedule.params.scheduleId,
        );
        const scheduleParsed: ISchedule = JSON.parse(newSchedule);
        setTime(toDate(Number(scheduleParsed.timestamp)));
        setDate(
          `${scheduleParsed.year}-${
            scheduleParsed.month < 10
              ? `0${scheduleParsed.month}`
              : scheduleParsed.month
          }-${scheduleParsed.day}`,
        );
        setTodos(scheduleParsed.todos.slice());
        setSchedule(scheduleParsed);
      }
    })();
  }, []);

  const createTodo = async (id: number, isSchedule: boolean): Promise<void> => {
    if (todos.length > 0) {
      if (isSchedule) {
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
    }
  };

  const handleToDoCreate = (): void => {
    if (
      todos &&
      todoText !== '' &&
      todos.findIndex((todo) => todo.description === todoText) === -1
    ) {
      const newTodos = todos.slice();
      newTodos.push({ description: todoText, done: 0 });
      setTodos(newTodos);
    }
  };

  const handleDeleteTodo = useCallback(
    (index) => {
      if (todos) {
        const newTodos = todos.slice();
        newTodos?.splice(index, 1);
        setTodos(newTodos);
        if (
          (routeReminder.params?.reminderId ||
            routeSchedule.params?.scheduleId) &&
          todos[index]
        ) {
          setDelTodos([...delTodos, todos[index].id as number]);
        }
      }
    },
    [todos],
  );

  const handleCheckTodo = (index: number): void => {
    if (todos[index]) {
      const newTodos = todos.slice();
      if (newTodos[index].done === 1) {
        newTodos[index].done = 0;
      } else {
        newTodos[index].done = 1;
      }
      if (
        updateTodos.findIndex((updTodo) => updTodo === newTodos[index].id) ===
        -1
      ) {
        setUpdateTodos([...updateTodos, newTodos[index].id as number]);
      } else {
        const newUpdateTodos = updateTodos.slice();
        const updTodoIndex = newUpdateTodos.findIndex(
          (updTodo) => updTodo === newTodos[index].id,
        );
        newUpdateTodos.splice(updTodoIndex, 1);
        setUpdateTodos(newUpdateTodos);
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

  const updateTodo = async (id: number, isSchedule: boolean): Promise<void> => {
    if (delTodos.length > 0) {
      delTodos.forEach(async (todoId) => {
        await ToDoController.delete(todoId);
      });
    }
    if (todos.length > 0) {
      if (isSchedule && schedule && todos !== schedule.todos) {
        todos.forEach(async (todo) => {
          schedule.todos.findIndex((schdltodo) => schdltodo.id === todo.id) ===
            -1 &&
            (await ToDoController.create(
              Number(todo.done),
              todo.description,
              id,
            ));
        });
      } else if (reminder && todos !== reminder.todos) {
        todos.forEach(async (todo) => {
          reminder.todos.findIndex((rmtodo) => rmtodo.id === todo.id) === -1 &&
            (await ToDoController.create(
              Number(todo.done),
              todo.description,
              undefined,
              id,
            ));
        });
      }
      if (updateTodos.length > 0) {
        updateTodos.forEach(async (updTodo) => {
          const todo = todos.find((td) => td.id === updTodo);
          if (todo) {
            await ToDoController.update(updTodo, todo.done);
          }
        });
      }
    }
  };

  const createSchedule = async (data: Data): Promise<void> => {
    const newDate = date.split(/-/g);
    const newSchedule = await SchedulesController.create(
      data.title,
      data.description,
      time.getTime().toString(),
      Number(newDate[0]),
      Number(newDate[1]),
      Number(newDate[2]),
    );

    if (newSchedule.id) {
      createTodo(newSchedule.id, true);
    }
    newSchedule.todos = todos;
    navigate('ScheduleContent', {
      date,
      schedule: newSchedule,
      isUpdate: false,
    });
  };

  const createReminder = async (data: Data): Promise<void> => {
    const dateNow = new Date();
    const newReminder = await RemindersController.create(
      data.title,
      dateNow.getFullYear(),
      dateNow.getMonth() + 1,
      dateNow.getDate(),
      data.description,
    );

    if (newReminder.id) {
      createTodo(newReminder.id, false);
    }
    newReminder.todos = todos;
    navigate('ReminderContent', { data: newReminder, isUpdate: false });
  };

  const updateReminder = async (data: Data): Promise<void> => {
    if (reminder) {
      const newReminder = await RemindersController.update(
        reminder.id,
        data.title,
        reminder.year,
        reminder.month,
        reminder.day,
        data.description,
      );

      if (newReminder.id) {
        await updateTodo(newReminder.id, false);
      }
      newReminder.todos = todos;
      navigate('ReminderContent', { data: newReminder, isUpdate: true });
    }
  };

  const updateSchedule = async (data: Data): Promise<void> => {
    if (schedule) {
      const newDate = date.split(/-/g);
      const newSchedule = await SchedulesController.update(
        schedule.id,
        data.title,
        data.description,
        time.getTime().toString(),
        Number(newDate[0]),
        Number(newDate[1]),
        Number(newDate[2]),
        schedule.done,
      );

      if (newSchedule.id) {
        await updateTodo(newSchedule.id, true);
      }
      newSchedule.todos = todos;
      navigate('ScheduleContent', {
        date,
        schedule: newSchedule,
        isUpdate: true,
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (routeSchedule.params?.scheduleId) {
      await SchedulesController.delete(routeSchedule.params.scheduleId);
      navigate('ScheduleContent', {
        deleteId: routeSchedule.params.scheduleId,
        date: format(
          new Date(
            schedule?.year as number,
            (schedule?.month as number) - 1,
            schedule?.day as number,
          ),
          'yyyy-MM-dd',
        ),
      });
    } else if (routeReminder.params?.reminderId) {
      await RemindersController.delete(routeReminder.params.reminderId);
      navigate('ReminderContent', {
        deleteId: routeReminder.params.reminderId,
      });
    }
  };

  const handleSubmit = async (data: Data): Promise<void> => {
    const schema = yup.object().shape({
      title: yup.string().required('The title is required.'),
      description: yup.string().notRequired(),
    });

    schema
      .validate(data, { abortEarly: false })
      .then(async () => {
        setError(false);
        if (routeIsSchedule.params.isSchedule) {
          if (schedule) {
            await updateSchedule(data);
          } else {
            await createSchedule(data);
          }
        } else if (reminder) {
          await updateReminder(data);
        } else {
          await createReminder(data);
        }
      })
      .catch((err) => {
        const errors = getValidationErrors(err);
        setError(true);

        formRef.current?.setErrors(errors);
      });
  };

  return (
    <Container marginTop={st.currentHeight}>
      <FormView onSubmit={handleSubmit} ref={formRef} style={{ flex: 1 }}>
        <Header
          goBack
          isInput
          edit={isEdit}
          error={error}
          onPressTrash={handleDelete}
          name="title"
          navigationBack={goBack}
          defaultValue={schedule?.title ?? reminder?.title ?? ''}
        />

        <FlatList
          ListHeaderComponent={
            <>
              <Topics>
                <TopicTitle>Description</TopicTitle>
                <Input
                  placeholder="Describe your task"
                  name="description"
                  multiline
                  defaultValue={
                    schedule?.description ?? reminder?.description ?? ''
                  }
                  style={{
                    marginHorizontal: 25,
                    flexWrap: 'wrap',
                  }}
                />
              </Topics>
              <TopicTitle style={{ marginTop: 10 }}>To Do</TopicTitle>
              <Input
                name="todo"
                placeholder="Your To Do"
                style={{ marginLeft: 25 }}
                onChangeText={(text) => setTodoText(text)}
                value={todoText}
                onSubmitEditing={() => {
                  handleToDoCreate();
                  setTodoText('');
                }}
              />
            </>
          }
          data={todos}
          renderItem={({ item, index }) => (
            <ToDo
              style={{ marginHorizontal: 25 }}
              disabled={false}
              done={item.done}
              description={item.description}
              onPressDelete={() => handleDeleteTodo(index)}
              onPressCheckBox={() => handleCheckTodo(index)}
              close
            />
          )}
          keyExtractor={(item) => item.description}
          style={{ flex: 1, minHeight: 300 }}
          ListFooterComponent={
            <>
              {routeIsSchedule.params?.isSchedule && (
                <>
                  <Topics>
                    <TopicTitle>Date</TopicTitle>
                    <Calendar
                      onDayPress={(day) => setDate(day.dateString)}
                      minDate={new Date()}
                      markedDates={{ [date]: { selected: true } }}
                      theme={{
                        selectedDayBackgroundColor: theme.primary,
                        arrowColor: theme.primary,
                        todayTextColor: theme.primary,
                      }}
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
        {!routeIsSchedule.params?.isSchedule && (
          <ButtonContainer>
            <Button onPress={() => formRef.current?.submitForm()}>Done</Button>
          </ButtonContainer>
        )}
      </FormView>
    </Container>
  );
};

export default Form;
