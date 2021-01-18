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

  static async update(id: number, done: number): Promise<void> {
    await ToDoService.update(id, done);
  }

  static async delete(id: number): Promise<number> {
    const rows = await ToDoService.delete(id);

    if (rows > 0) {
      return rows;
    }
    throw new Error('Unable to delete the to do.');
  }
}
