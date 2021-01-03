import Todo from '../Todo';

interface CreateSchedule {
  title: string;
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
    id,
  }: CreateSchedule) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.timestamp = timestamp;
    this.day = day;
    this.month = month;
    this.year = year;
    this.todos = [];
  }
}
