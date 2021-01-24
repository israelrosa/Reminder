import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar as st, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import CreateButton from '../../components/CreateButton';
import EmptyData from '../../components/EmptyData';
import Header from '../../components/Header';
import Task from '../../components/Task';
import RemindersController from '../../controller/RemindersController';
import IReminder from '../../models/Reminder/interface';
import { theme } from '../../styles/theme';
import { Container } from './styles';

type RootParams = {
  Form: { data: IReminder; isUpdate: boolean; deleteId: number };
};

type RouteParam = RouteProp<RootParams, 'Form'>;

const Reminder: React.FC = () => {
  const { navigate } = useNavigation();
  const route = useRoute<RouteParam>();
  const [reminders, setReminders] = useState<IReminder[]>([]);

  useEffect(() => {
    (async (): Promise<void> => {
      const data = await RemindersController.showAll();
      const reminder = JSON.parse(data);

      setReminders(reminder);
    })();
  }, []);

  useEffect(() => {
    if (route.params) {
      if (
        reminders.findIndex((rmndrs) => rmndrs.id === route.params.data.id) ===
        -1
      ) {
        const reminder = reminders.slice();
        reminder.push(route.params.data);
        setReminders(reminder);
      } else if (route.params.isUpdate) {
        const reminder = reminders.slice();
        const index = reminder.findIndex(
          (rmndrs) => rmndrs.id === route.params.data.id,
        );

        reminder[index] = route.params.data;

        setReminders(reminder);
      } else if (route.params.deleteId) {
        const reminder = reminders.slice();
        const index = reminder.findIndex(
          (rmndr) => rmndr.id === route.params.deleteId,
        );
        reminder.splice(index);
        setReminders(reminder);
      }
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
      {reminders.length > 0 ? (
        <FlatList
          data={reminders}
          renderItem={({ item }) => (
            <Task
              id={item.id}
              title={item.title}
              date={format(new Date(item.year, item.month, item.day), 'dd/MM')}
              description={item.description}
              ToDoArrayData={item.todos}
              handleTask={handleDeleteReminder}
              handleNavigate={() => {
                navigate('ReminderForm', { reminderId: item.id });
              }}
              color={theme.error}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 15 }}
        />
      ) : (
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <EmptyData>No reminders found.</EmptyData>
        </View>
      )}
      <StatusBar backgroundColor="#7E84FF" style="light" />
      <CreateButton onPress={handleNavigate} />
    </Container>
  );
};

export default Reminder;
