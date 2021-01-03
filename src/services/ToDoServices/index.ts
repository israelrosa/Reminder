import { SQLResultSet, WebSQLDatabase } from 'expo-sqlite';

import { databaseConnection } from '../../database';
import ToDo from '../../models/todo';

export default class ToDoService {
  private static table = 'todos';

  private static db: WebSQLDatabase = databaseConnection.getConnection();

  static create(todo: ToDo): Promise<ToDo> {
    return new Promise((resolve, reject) =>
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT INTO ${this.table} (description, done, schedule_id, reminder_id) VALUES (?, ?, ?, ?)`,
            [todo.description, todo.done, todo.schedule_id, todo.reminder_id],
            (_, { insertId }) => {
              const newTodo = todo;
              newTodo.id = insertId;
              resolve(newTodo);
            },
          );
        },
        (err) => console.log(`error:${err}`),
      ),
    );
  }

  static findScheduleTodos(schedule_id: number): Promise<string> {
    return new Promise((resolve, reject) =>
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${this.table} WHERE schedule_id = ?`,
          [schedule_id],
          (_, rows) => resolve(JSON.stringify(rows)),
        );
      }),
    );
  }

  static delete(id: number): void {
    this.db.transaction((tx) =>
      tx.executeSql(`DELETE FROM ${this.table} WHERE id = ?`, [id]),
    );
  }

  static update(todo: ToDo): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) =>
        tx.executeSql(
          `UPDATE ${this.table} set active = ?, description = ? where id = ?`,
          [todo.done, todo.description, todo.id],
          (_, row) => {
            resolve(row);
          },
        ),
      );
    });
  }
}
