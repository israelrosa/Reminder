import { format, toDate } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar as st, Text, View } from 'react-native';
import { Agenda, AgendaItemsMap } from 'react-native-calendars';

// import TaskHome from '../../components/TaskHome';

import Header from '../../components/Header';
import ToDo from '../../components/ToDo';
import RemindersController from '../../controller/RemindersController';
import SchedulesController from '../../controller/SchedulesController';
import { theme } from '../../styles/theme';
import {
  Container,
  ReminderContainer,
  ReminderDescription,
  ReminderTitle,
  ScheduleContainer,
  ScheduleDescription,
  ScheduleHeader,
  ScheduleTime,
  ScheduleTitle,
  ScrollContainer,
  Topics,
} from './styles';

interface ToDos {
  done: number;
  description: string;
}

interface ReminderContent {
  id: number;
  title: string;
  description: string;
  todos: ToDos[];
  year: number;
  month: number;
  day: number;
}
interface ScheduleContent {
  id: number;
  title: string;
  description: string;
  done: number;
  todos: ToDos[];
  timestamp: string;
  year: number;
  month: number;
  day: number;
}

const Home: React.FC = () => {
  const [schedules, setSchedules] = useState<AgendaItemsMap<ScheduleContent>>(
    {},
  );
  const [reminders, setReminders] = useState<ReminderContent[]>([]);

  useEffect(() => {
    (async () => {
      const data = await SchedulesController.showAll();

      const scheduleArray: AgendaItemsMap<ScheduleContent> = JSON.parse(data);

      setSchedules(scheduleArray);
    })();
  }, []);

  useEffect(() => {
    (async (): Promise<void> => {
      const data = await RemindersController.showAll();
      const reminder = JSON.parse(data);

      setReminders(reminder);
    })();
  }, []);

  return (
    <Container marginTop={st.currentHeight}>
      <Header title="TODO" />
      {/* {schedules[0][]. > 0 && (
        <TaskHome
          date={new Date(toDate(Number(schedules[0].timestamp)))}
          title={schedules[0].title}
          toDoArrayData={schedules[0].todos}
          description={schedules[0].description}
          isDisabled
        />
      )} */}
      <ScrollContainer>
        {reminders.length > 0 && (
          <>
            <Topics>Don&apos;t Forget</Topics>
            <ScrollContainer>
              {reminders.map((item) => (
                <ReminderContainer
                  key={item.id}
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
                  }}
                >
                  <ReminderTitle>{item.title}</ReminderTitle>
                  <ReminderDescription>{item.description}</ReminderDescription>
                </ReminderContainer>
              ))}
            </ScrollContainer>
          </>
        )}
        <Agenda
          items={schedules}
          renderItem={(item, firstItemInDay) => (
            <ScheduleContainer
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
                borderRadius: 30,
                flex: 1,
                margin: 5,
              }}
            >
              <ScheduleHeader>
                <ScheduleTitle>{item.title}</ScheduleTitle>
                <ScheduleTime>
                  {format(new Date(toDate(Number(item.timestamp))), 'p')}
                </ScheduleTime>
              </ScheduleHeader>
              <ScheduleDescription>{item.description}</ScheduleDescription>
              <FlatList
                data={item.todos}
                renderItem={({ item: todoItem }) => (
                  <ToDo
                    done={item.done}
                    disabled
                    description={item.description}
                    close={false}
                  />
                )}
                keyExtractor={(todoItem) => todoItem.description}
              />
            </ScheduleContainer>
          )}
          markingType="custom"
          selected="2021-01-05"
          pastScrollRange={12}
          futureScrollRange={12}
          rowHasChanged={(r1, r2) => {
            return r1.id !== r2.id;
          }}
          renderEmptyDate={() => (
            <View>
              <Text>No service on this date</Text>
            </View>
          )}
          renderEmptyData={() => {
            return (
              <View>
                <Text>No service on this date</Text>
              </View>
            );
          }}
          theme={{
            calendarBackground: 'white',
            backgroundColor: 'transparent',
            selectedDayBackgroundColor: theme.primary,
            todayTextColor: theme.primary,
            agendaKnobColor: theme.primary,
            agendaDayTextColor: theme.primary,
            agendaDayNumColor: theme.primary,
            agendaTodayColor: theme.primary,
          }}
        />
      </ScrollContainer>
    </Container>
  );
};

export default Home;
