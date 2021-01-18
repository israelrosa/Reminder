import IToDos from '../ToDo/interface';

export default interface ISchedule {
  id: number;
  title: string;
  description: string;
  done: number;
  todos: IToDos[];
  timestamp: string;
  year: number;
  month: number;
  day: number;
}
