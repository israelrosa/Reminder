import { format } from 'date-fns';

import Schedule from '../models/Schedule';
import ScheduleService from '../services/ScheduleServices';
// import ToDoService from '../services/ToDoServices';

interface ScheduleFormat {
  id: number;
  title: string;
  description: string;
  done: number;
  timestamp: string;
  year: number;
  month: number;
  day: number;
  todos: ToDos[];
}
interface ToDos {
  done: number;
  description: string;
}

interface ScheduleContent {
  id: number;
  title: string;
  description: string;
  done: number;
  todo_description: string;
  todo_done: number;
  timestamp: string;
  year: number;
  month: number;
  day: number;
}

interface ScheduleData {
  rows: {
    _array: ScheduleContent[];
  };
}

type ScheduleDate = [date: string, schedule: ScheduleFormat[]];

type ScheduleArrayDate = ScheduleDate[];

export default class SchedulesController {
  static async create(
    title: string,
    description: string,
    timestamp: string,
    year: number,
    month: number,
    day: number,
  ): Promise<Schedule> {
    const schedule = new Schedule({
      day,
      month,
      timestamp,
      title,
      year,
      description,
    });
    const result = await ScheduleService.create(schedule);
    return result;
  }

  static async delete(id: number): Promise<number> {
    const result = await ScheduleService.delete(id);

    if (result === 0) {
      throw new Error('Unable to delete the schedule.');
    }
    return result;
  }

  static async showAllByDate(
    year: number,
    month: number,
    day: number,
  ): Promise<string> {
    const data = await ScheduleService.findAllByDate(year, month, day);

    const schedule: ScheduleData = JSON.parse(data);

    const index: ScheduleFormat[] = [];
    const result: ScheduleFormat[] = [];
    schedule.rows._array.forEach((row) => {
      if (!(row.id in index)) {
        index[row.id] = {
          id: row.id,
          day: row.day,
          description: row.description,
          done: row.done,
          month: row.month,
          timestamp: row.timestamp,
          title: row.title,
          todos: [] as ToDos[],
          year: row.year,
        };
        result.push(index[row.id]);
      }
      if (row.todo_description !== null && row.done !== null) {
        index[row.id].todos.push({
          description: row.todo_description,
          done: row.todo_done,
        });
      }
    });

    return JSON.stringify(result);
  }

  static async showAll(): Promise<string> {
    const data = await ScheduleService.findAll();

    const schedule: ScheduleData = JSON.parse(data);

    const index: ScheduleFormat[] = [];
    const formated: ScheduleFormat[] = [];
    schedule.rows._array.forEach((row) => {
      if (!(row.id in index)) {
        index[row.id] = {
          id: row.id,
          day: row.day,
          description: row.description,
          done: row.done,
          month: row.month,
          timestamp: row.timestamp,
          title: row.title,
          todos: [] as ToDos[],
          year: row.year,
        };
        formated.push(index[row.id]);
      }
      if (row.todo_description !== null && row.done !== null) {
        index[row.id].todos.push({
          description: row.todo_description,
          done: row.todo_done,
        });
      }
    });

    const result: ScheduleArrayDate = [];

    formated.forEach((schdl) => {
      const date = format(
        new Date(schdl.year, schdl.month - 1, schdl.day),
        'yyyy-MM-dd',
      );
      const indx = result.findIndex((e) => e[0] === date);
      if (indx === -1) {
        result.push([date, [schdl]]);
      } else {
        result[indx][1].push(schdl);
      }
    });

    return JSON.stringify(Object.fromEntries(result));
  }

  static async showOne(id: number): Promise<string> {
    const data = await ScheduleService.findById(id);

    return JSON.stringify(data);
  }

  static async update(
    id: number,
    title: string,
    description: string,
    timestamp: string,
    year: number,
    month: number,
    day: number,
  ): Promise<Schedule> {
    const schedule = new Schedule({
      timestamp,
      title,
      description,
      id,
      day,
      month,
      year,
    });

    await ScheduleService.update(schedule);

    return schedule;
  }
}
