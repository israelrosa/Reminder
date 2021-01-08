import Todo from '../Todo';

interface CreateSchedule {
  title: string;
  done?: number;
  timestamp: string;
  description?: string;
  year: number;
  month: number;
  day: number;
  id?: number;
}

export default class Schedule {
  id?: number;

  title: string;

  description?: string;

  done: number;

  todos: Todo[];

  timestamp: string;

  year: number;

  month: number;

  day: number;

  constructor({
    title,
    timestamp,
    day,
    month,
    year,
    description,
    done,
    id,
  }: CreateSchedule) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.timestamp = timestamp;
    this.done = done ?? 0;
    this.day = day;
    this.month = month;
    this.year = year;
    this.todos = [];
  }
}
