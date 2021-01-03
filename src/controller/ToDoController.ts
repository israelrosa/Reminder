import ToDo from '../models/ToDo';
import ToDoService from '../services/ToDoServices';

export default class ToDoController {
  static async create(
    done: number,
    description: string,
    schedule_id?: number,
    reminder_id?: number,
  ): Promise<ToDo> {
    if (schedule_id || reminder_id) {
      const todo = new ToDo(done, description, schedule_id, reminder_id);
      const result = await ToDoService.create(todo);
      return result;
    }
    throw new Error(
      'Não é possível criar um To Do para um lembrete e um cronograma, escolha apenas um.',
    );
  }

  static async update(
    id: number,
    done: number,
    description: string,
  ): Promise<ToDo> {
    const todo = new ToDo(id, description, done);

    await ToDoService.update(todo);

    return todo;
  }

  static async findScheduleTodos(schedule_id: number): Promise<string> {
    const data = await ToDoService.findScheduleTodos(schedule_id);

    return JSON.stringify(data);
  }

  static delete(id: number): void {
    ToDoService.delete(id);
  }
}
