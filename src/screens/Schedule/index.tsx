/* eslint-disable no-useless-computed-key */
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { format, toDate } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StatusBar as st, Text, View } from 'react-native';
import { Agenda, AgendaItemsMap } from 'react-native-calendars';

import CreateButton from '../../components/CreateButton';
import EmptyData from '../../components/EmptyData';
import Header from '../../components/Header';
import Task from '../../components/Task';
import SchedulesController from '../../controller/SchedulesController';
import { theme } from '../../styles/theme';
import { Container } from './styles';

interface ToDos {
  done: number;
  description: string;
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

type RootParamList = {
  Form: {
    date: string;
    schedule: ScheduleContent;
    isUpdate: boolean;
  };
};

type RouteParams = RouteProp<RootParamList, 'Form'>;

const Schedule: React.FC = () => {
  const { navigate } = useNavigation();
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [percentage, setPercentage] = useState(0);
  const [schedules, setSchedules] = useState<AgendaItemsMap<ScheduleContent>>(
    {},
  );
  const route = useRoute<RouteParams>();

  //Puxa dados do banco
  useEffect(() => {
    (async () => {
      const data = await SchedulesController.showAll();

      const scheduleArray: AgendaItemsMap<ScheduleContent> = JSON.parse(data);
      setSchedules(scheduleArray);
    })();
  }, []);

  //Introduz novos todos e atualizações dentro do state.
  useEffect(() => {
    if (route.params) {
      const scheduleArray = Object.entries(schedules).slice();

      const newDate = scheduleArray.findIndex(
        (schdlarray) => schdlarray[0] === route.params.date,
      );

      const previousDate = scheduleArray.findIndex(
        (schdlarray) =>
          schdlarray[1].findIndex(
            (schdl) => schdl.id === route.params.schedule.id,
          ) !== -1,
      );

      //verifica se já foi criado a nova data no schedule.
      if (newDate !== -1) {
        const scheduleIndex = scheduleArray[newDate][1]?.findIndex(
          (schdl) => schdl.id === route.params.schedule.id,
        );
        // Verificando se o schedule não foi introduzido no array.
        if (scheduleArray[newDate] && scheduleIndex === -1) {
          scheduleArray[newDate][1].push(route.params.schedule);
        } else if (route.params.isUpdate) {
          scheduleArray[newDate][1].splice(scheduleIndex, 1);
          scheduleArray[newDate][1].push(route.params.schedule);
        }
        if (
          scheduleArray[previousDate] &&
          scheduleArray[previousDate][0] !== route.params.date
        ) {
          const previousSchedule = scheduleArray[previousDate][1].findIndex(
            (schdl) => schdl.id === route.params.schedule.id,
          );
          if (scheduleArray[previousDate][1].length > 1) {
            scheduleArray[previousDate][1].splice(previousSchedule);
          } else {
            scheduleArray.splice(previousDate, 1);
          }
          setSchedules(Object.fromEntries(scheduleArray));
        }
        setSchedules(Object.fromEntries(scheduleArray));
      } else if (route.params.isUpdate) {
        const previousSchedule = scheduleArray[previousDate][1].findIndex(
          (schdl) => schdl.id === route.params.schedule.id,
        );

        if (scheduleArray[previousDate][1].length > 1) {
          scheduleArray[previousDate][1].splice(previousSchedule);
          scheduleArray.push([route.params.date, [route.params.schedule]]);

          setSchedules(Object.fromEntries(scheduleArray));
        } else {
          scheduleArray.splice(previousDate, 1);
          scheduleArray.push([route.params.date, [route.params.schedule]]);
          setSchedules(Object.fromEntries(scheduleArray));
        }
      } else {
        scheduleArray.push([route.params.date, [route.params.schedule]]);

        setSchedules(Object.fromEntries(scheduleArray));
      }
    }
  }, [route.params]);

  //Calcula a porcentagem de tarefas concluídas.
  useEffect(() => {
    schedules[date]?.forEach((schdl) => {
      if (schdl.done === 1) {
        setPercentage((percentage + schdl.done) / schedules[date].length);
      }
    });
  }, [date]);

  const handleDoneTask = async (id: number): Promise<void> => {
    await SchedulesController.updateDone(1, id);
  };

  return (
    <Container marginTop={st.currentHeight}>
      <Header percentage={percentage || 101} />
      <Agenda
        items={schedules}
        renderItem={(item) => (
          <Task
            ToDoArrayData={item.todos}
            date={format(toDate(Number(item.timestamp)), 'p')}
            id={item.id}
            title={item.title}
            description={item.description}
            handleTask={handleDoneTask}
            handleNavigate={() => {
              navigate('ScheduleForm', {
                scheduleId: schedules[date]?.find(
                  (schdl) => schdl.id === item.id,
                )?.id,
                isSchedule: true,
              });
            }}
            borderColor="0, 255, 0"
          />
        )}
        markingType="custom"
        selected={format(new Date(), 'yyyy-MM-dd')}
        pastScrollRange={12}
        futureScrollRange={12}
        onDayPress={(day) => setDate(day.dateString)}
        rowHasChanged={(r1, r2) => {
          return r1 !== r2;
        }}
        renderEmptyDate={() => (
          <View>
            <Text>No service on this date</Text>
          </View>
        )}
        renderEmptyData={() => {
          return <EmptyData>No task found for this day.</EmptyData>;
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
      <CreateButton
        onPress={() => navigate('ScheduleForm', { isSchedule: true, date })}
      />
      <StatusBar backgroundColor="#7E84FF" style="light" />
    </Container>
  );
};

export default Schedule;
