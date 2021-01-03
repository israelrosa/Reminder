/* eslint-disable no-console */
import { SQLResultSet, WebSQLDatabase } from 'expo-sqlite';

import { databaseConnection } from '../../database';
import Schedule from '../../models/Schedule';

export default class ScheculeService {
  private static table = 'schedules';

  private static db: WebSQLDatabase = databaseConnection.getConnection();

  static async create(schedule: Schedule): Promise<Schedule> {
    const newSchedule = schedule;
    return new Promise((resolve, reject) =>
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT INTO ${this.table} (title, description, year, month, day, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              schedule.title,
              schedule.description,
              schedule.year,
              schedule.month,
              schedule.day,
              schedule.timestamp,
            ],
            (_, { insertId }) => {
              newSchedule.id = insertId;
              resolve(newSchedule);
            },
          );
        },
        (err) => console.log(`error:${err}`),
      ),
    );
  }

  static async findAll(
    year: number,
    month: number,
    day: number,
  ): Promise<string> {
    return new Promise((resolve, reject) =>
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT a.id, a.title, a.description, a.year, a.month, a.day, a.timestamp, b.description AS todo_description, b.done FROM ${this.table} as a LEFT JOIN todos as b on a.id = b.schedule_id where a.year = ? AND a.month = ? AND a.day = ? ORDER BY a.timestamp ASC`,
            [year, month, day],
            (_, rows) => resolve(JSON.stringify(rows)),
          );
        },
        (err) => console.log(`error:${err}`),
      ),
    );
  }

  static findById(id: number): Promise<SQLResultSet> {
    return new Promise((resolve, reject) =>
      this.db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${this.table} LEFT JOIN todos ON ${this.table}.id = todos.id where id = ?`,
          [id],
          (_, rows) => resolve(rows),
        );
      }),
    );
  }

  static delete(id: number): void {
    this.db.transaction((tx) =>
      tx.executeSql(`DELETE FROM ${this.table} WHERE id = ?`, [id]),
    );
  }

  static update(schedule: Schedule): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) =>
        tx.executeSql(
          `UPDATE ${this.table} set title = ?, description = ?, year = ?, month = ?, day = ?, timestamp = ? where id = ?`,
          [
            schedule.title,
            schedule.description,
            schedule.year,
            schedule.month,
            schedule.day,
            schedule.timestamp,
            schedule.id,
          ],
          (_, row) => {
            resolve(row);
          },
        ),
      );
    });
  }
}
