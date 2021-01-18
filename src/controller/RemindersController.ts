import IReminder from 'models/Reminder/interface';

import Reminder from '../models/Reminder';
import ReminderService from '../services/ReminderServices';

interface ToDos {
  done: number;
  description: string;
}

interface ReminderContent {
  id: number;
  title: string;
  description: string;
  todo_description: string;
  todo_id: number;
  done: number;
  year: number;
  month: number;
  day: number;
}

interface ReminderData {
  rows: {
    _array: ReminderContent[];
  };
}

export default class RemindersController {
  static async create(
    title: string,
    year: number,
    month: number,
    day: number,
    description?: string,
  ): Promise<Reminder> {
    const reminder = new Reminder(title, year, month, day, description);

    const data = await ReminderService.create(reminder);

    return data;
  }

  static delete(id: number): void {
    ReminderService.delete(id);
  }

  static update(
    id: number,
    title: string,
    year: number,
    month: number,
    day: number,
    description?: string,
  ): Reminder {
    const reminder = new Reminder(title, year, month, day, description, id);
    ReminderService.update(reminder);

    return reminder;
  }

  static async showAll(): Promise<string> {
    const data = await ReminderService.findAll();

    const reminder: ReminderData = JSON.parse(data);

    const index: IReminder[] = [];
    const result: IReminder[] = [];
    reminder.rows._array.forEach((row) => {
      if (!(row.id in index)) {
        index[row.id] = {
          id: row.id,
          day: row.day,
          description: row.description,
          month: row.month,
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
    const data = await ReminderService.findOne(id);

    const reminder: ReminderData = JSON.parse(data);

    const index: IReminder[] = [];
    const result: IReminder[] = [];
    reminder.rows._array.forEach((row) => {
      if (!(row.id in index)) {
        index[row.id] = {
          id: row.id,
          day: row.day,
          description: row.description,
          month: row.month,
          title: row.title,
          todos: [] as ToDos[],
          year: row.year,
        };
        result.push(index[row.id]);
      }
      if (row.todo_description !== null && row.done !== null) {
        index[row.id].todos.push({
          id: row.todo_id,
          description: row.todo_description,
          done: row.done,
        });
      }
    });

    return JSON.stringify(result[0]);
  }
}
