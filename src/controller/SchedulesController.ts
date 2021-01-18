import { format } from 'date-fns';

import ISchedule from 'models/Schedule/interface';
import IToDos from 'models/ToDo/interface';

import Schedule from '../models/Schedule';
import ScheduleService from '../services/ScheduleServices';
// import ToDoService from '../services/ToDoServices';
interface ScheduleContent {
  id: number;
  title: string;
  description: string;
  done: number;
  todo_id: number;
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

type ScheduleDate = [date: string, schedule: ISchedule[]];

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

    if (result > 0) {
      return result;
    }
    throw new Error('Unable to delete the schedule.');
  }

  static async showAllByDate(
    year: number,
    month: number,
    day: number,
  ): Promise<string> {
    const data = await ScheduleService.findAllByDate(year, month, day);

    const schedule: ScheduleData = JSON.parse(data);

    const index: ISchedule[] = [];
    const result: ISchedule[] = [];
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
          todos: [] as IToDos[],
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

    const index: ISchedule[] = [];
    const formatted: ISchedule[] = [];
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
          todos: [] as IToDos[],
          year: row.year,
        };
        formatted.push(index[row.id]);
      }
      if (row.todo_description !== null && row.done !== null) {
        index[row.id].todos.push({
          description: row.todo_description,
          done: row.todo_done,
        });
      }
    });

    const result: ScheduleArrayDate = [];

    formatted.forEach((schdl) => {
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
    const data = await ScheduleService.findOne(id);

    const schedule: ScheduleData = JSON.parse(data);

    const index: ISchedule[] = [];
    const result: ISchedule[] = [];
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
          todos: [] as IToDos[],
          year: row.year,
        };
        result.push(index[row.id]);
      }
      if (row.todo_description !== null && row.done !== null) {
        index[row.id].todos.push({
          id: row.todo_id,
          description: row.todo_description,
          done: row.todo_done,
        });
      }
    });
    return JSON.stringify(result[0]);
  }

  static async update(
    id: number,
    title: string,
    description: string,
    timestamp: string,
    year: number,
    month: number,
    day: number,
    done: number,
  ): Promise<Schedule> {
    const schedule = new Schedule({
      timestamp,
      title,
      description,
      id,
      day,
      done,
      month,
      year,
    });

    await ScheduleService.update(schedule);

    return schedule;
  }

  static async updateDone(done: number, id: number): Promise<void> {
    await ScheduleService.updateDone(done, id);
  }
}
