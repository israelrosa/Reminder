import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar as st } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import CreateButton from '../../components/CreateButton';
import Header from '../../components/Header';
import Task from '../../components/Task';
import RemindersController from '../../controller/RemindersController';
import { Container } from './styles';

interface ToDos {
  done: number;
  description: string;
}

interface ReminderData {
  id: number;
  title: string;
  description: string;
  day: number;
  month: number;
  year: number;
  todos: ToDos[];
}

type RootParams = {
  Form: { data: ReminderData };
};

type RouteParam = RouteProp<RootParams, 'Form'>;

const Reminder: React.FC = () => {
  const { navigate } = useNavigation();
  const route = useRoute<RouteParam>();
  const [reminders, setReminders] = useState<ReminderData[]>([]);

  useEffect(() => {
    (async (): Promise<void> => {
      const data = await RemindersController.showAll();
      const reminder = JSON.parse(data);

      setReminders(reminder);
    })();
  }, []);

  useEffect(() => {
    if (
      route.params &&
      reminders.findIndex((rmndrs) => rmndrs.id === route.params.data.id) === -1
    ) {
      const reminder = reminders.slice();
      reminder.push(route.params.data);
      setReminders(reminder);
    }
  }, [route.params]);

  const handleNavigate = useCallback(() => {
    navigate('ReminderForm', { isSchedule: false });
  }, [navigate]);

  const handleDeleteReminder = async (id: number): Promise<void> => {
    const newReminder = reminders.slice();
    const index = reminders.findIndex((reminder) => reminder.id === id);
    newReminder.splice(index, 1);
    setReminders(newReminder);
    await RemindersController.delete(id);
  };
  return (
    <Container marginTop={st.currentHeight}>
      <Header title="Reminder" />
      <FlatList
        data={reminders}
        renderItem={({ item }) => (
          <Task
            id={item.id}
            title={item.title}
            date={format(new Date(item.year, item.month, item.day), 'dd/MM')}
            isDisabled
            description={item.description}
            ToDoArrayData={item.todos}
            handleDeleteTask={handleDeleteReminder}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 15 }}
      />
      <StatusBar backgroundColor="#7E84FF" style="light" />
      <CreateButton onPress={handleNavigate} />
    </Container>
  );
};

export default Reminder;
