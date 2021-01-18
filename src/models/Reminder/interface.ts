import IToDos from '../ToDo/interface';

export default interface IReminder {
  id: number;
  title: string;
  description: string;
  todos: IToDos[];
  year: number;
  month: number;
  day: number;
}
