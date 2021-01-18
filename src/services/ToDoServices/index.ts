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

  static async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.db.transaction((tx) =>
        tx.executeSql(
          `DELETE FROM ${this.table} WHERE id = ?`,
          [id],
          (_, { rowsAffected }) => {
            resolve(rowsAffected);
          },
        ),
      );
    });
  }

  static update(id: number, done: number): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) =>
          tx.executeSql(
            `UPDATE ${this.table} set done = ? where id = ?`,
            [done, id],
            (_, row) => {
              resolve(row);
            },
          ),
        (err) => console.log(err),
      );
    });
  }
}
