import Todo from '../Todo';

export default class Reminder {
  id?: number;

  title: string;

  description?: string;

  year: number;

  month: number;

  day: number;

  todos: Todo[];

  constructor(
    title: string,
    year: number,
    month: number,
    day: number,
    description?: string,
    id?: number,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.day = day;
    this.month = month;
    this.year = year;
    this.todos = [];
  }
}
