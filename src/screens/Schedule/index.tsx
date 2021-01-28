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
    deleteId: number;
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

      const hasDate = scheduleArray.findIndex(
        (schdlarray) => schdlarray[0] === route.params.date,
      );

      const previousDate = scheduleArray.findIndex(
        (schdlarray) =>
          schdlarray[1].findIndex(
            (schdl) => schdl.id === route.params.schedule.id,
          ) !== -1,
      );

      // Verifica se já foi criado a nova data no schedule se já foi ele entra.
      if (hasDate !== -1) {
        // Verifica se é para deletar o schedule.
        if (route.params.deleteId) {
          const schdlIndex = scheduleArray[hasDate][1].findIndex(
            (schdl) => schdl.id === route.params.deleteId,
          );
          scheduleArray[hasDate][1].splice(schdlIndex, 1);
          if (scheduleArray[hasDate][1].length === 0) {
            scheduleArray.splice(hasDate, 1);
          }
          setSchedules(Object.fromEntries(scheduleArray));
          // Se não ele cria um schedule
        } else {
          const scheduleIndex = scheduleArray[hasDate][1]?.findIndex(
            (schdl) => schdl.id === route.params.schedule.id,
          );
          // Se o schedule não foi introduzido no array ele entra.
          if (scheduleArray[hasDate] && scheduleIndex === -1) {
            scheduleArray[hasDate][1].push(route.params.schedule);
          } else if (route.params.isUpdate) {
            // Se for para atualizar ele entra.
            scheduleArray[hasDate][1][scheduleIndex] = route.params.schedule;
            // Verifica se a data do schedule mudou, se não mudou ele não entra.
            if (
              scheduleArray[previousDate] &&
              scheduleArray[previousDate][0] !== route.params.date
            ) {
              // Verifica se ainda há outros schedules na data anterior além do schedule antigo, se tiver, ele vai deletar apenas o schedule antigo.
              if (scheduleArray[previousDate][1].length > 1) {
                const previousSchedule = scheduleArray[
                  previousDate
                ][1].findIndex(
                  (schdl) => schdl.id === route.params.schedule.id,
                );
                scheduleArray[previousDate][1].splice(previousSchedule);
              } else {
                // Se não ele deleta a data inteira.
                scheduleArray.splice(previousDate, 1);
              }
              setSchedules(Object.fromEntries(scheduleArray));
            }
          }
          setSchedules(Object.fromEntries(scheduleArray));
        }
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
  const calcPercentage = (): void => {
    if (schedules[date]) {
      let total = 0;
      schedules[date]?.forEach((schdl) => {
        if (schdl.done === 1) {
          total += schdl.done;
        }
      });
      setPercentage((total / schedules[date].length) * 100);
    } else {
      setPercentage(0);
    }
  };

  useEffect(() => {
    calcPercentage();
  }, [date, route.params]);

  const handleDoneTask = async (id: number): Promise<void> => {
    await SchedulesController.updateDone(1, id);

    const schedulesArray = Object.entries(schedules).slice();

    let scheduleIndex = 0;

    const arrayIndex = schedulesArray.findIndex((schdlarray) => {
      scheduleIndex = schdlarray[1].findIndex((schdl) => schdl.id === id);
      return scheduleIndex !== -1;
    });

    schedulesArray[arrayIndex][1][scheduleIndex].done = 1;

    setSchedules(Object.fromEntries(schedulesArray));
    calcPercentage();
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
            isDone={Boolean(item.done)}
            handleNavigate={() => {
              navigate('ScheduleForm', {
                scheduleId: item.id,
                isSchedule: true,
              });
            }}
            color={theme.sucess}
          />
        )}
        markingType="custom"
        selected={format(new Date(), 'yyyy-MM-dd')}
        pastScrollRange={1}
        futureScrollRange={12}
        onDayPress={(day) => setDate(day.dateString)}
        rowHasChanged={(r1, r2) => {
          return r1 !== r2 || r1.done === r2.done;
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
