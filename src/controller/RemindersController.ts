import Reminder from '../models/Reminder';
import ReminderService from '../services/ReminderServices';

interface ReminderFormat {
  id: number;
  title: string;
  description: string;
  todos: ToDos[];
  year: number;
  month: number;
  day: number;
}

interface ToDos {
  done: number;
  description: string;
}

interface ReminderContent {
  id: number;
  title: string;
  description: string;
  todo_description: string;
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
    title: string,
    year: number,
    month: number,
    day: number,
    description?: string,
  ): Reminder {
    const reminder = new Reminder(title, year, month, day, description);
    ReminderService.update(reminder);

    return reminder;
  }

  static async showAll(): Promise<string> {
    const data = await ReminderService.findAll();

    const reminder: ReminderData = JSON.parse(data);

    const index: ReminderFormat[] = [];
    const result: ReminderFormat[] = [];
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
}
