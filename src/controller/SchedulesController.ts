import Schedule from '../models/Schedule';
import ScheduleService from '../services/ScheduleServices';
// import ToDoService from '../services/ToDoServices';

interface ScheduleFormat {
  id: number;
  title: string;
  description: string;
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
  todo_description: string;
  done: number;
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
      title,
      description,
      timestamp,
      day,
      month,
      year,
    });
    const result = await ScheduleService.create(schedule);
    return result;
  }

  static delete(id: number): void {
    ScheduleService.delete(id);
  }

  static async showAll(
    year: number,
    month: number,
    day: number,
  ): Promise<string> {
    const data = await ScheduleService.findAll(year, month, day);

    const schedule: ScheduleData = JSON.parse(data);

    const index: ScheduleFormat[] = [];
    const result: ScheduleFormat[] = [];
    schedule.rows._array.forEach((row) => {
      if (!(row.id in index)) {
        index[row.id] = {
          id: row.id,
          day: row.day,
          description: row.description,
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
          done: row.done,
        });
      }
    });

    return JSON.stringify(result);
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
