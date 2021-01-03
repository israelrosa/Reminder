export default class ToDo {
  id?: number;

  done: number;

  description: string;

  schedule_id?: number;

  reminder_id?: number;

  constructor(
    done: number,
    description: string,
    schedule_id?: number,
    reminder_id?: number,
    id?: number,
  ) {
    this.id = id;
    this.done = done;
    this.description = description;
    this.schedule_id = schedule_id;
    this.reminder_id = reminder_id;
  }
}
