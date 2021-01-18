/* eslint-disable no-console */
import { SQLResultSet, WebSQLDatabase } from 'expo-sqlite';

import { databaseConnection } from '../../database';
import Reminder from '../../models/Reminder';

export default class ReminderService {
  private static table = 'reminders';

  private static db: WebSQLDatabase = databaseConnection.getConnection();

  static async create(reminder: Reminder): Promise<Reminder> {
    return new Promise((resolve, reject) =>
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT INTO ${this.table} (title, description, day, month, year) VALUES (?, ?, ?, ?, ?)`,
            [
              reminder.title,
              reminder.description,
              reminder.day,
              reminder.month,
              reminder.year,
            ],
            (_, { insertId }) => {
              const newReminder = reminder;
              newReminder.id = insertId;
              resolve(newReminder);
            },
          );
        },
        (err) => console.log(err),
      ),
    );
  }

  static findAll(): Promise<string> {
    return new Promise((resolve, reject) =>
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT a.id, a.title, a.description, a.day, a.month, a.year, b.description as todo_description, b.done FROM ${this.table} AS a LEFT JOIN todos AS b ON a.id = b.reminder_id`,
            [],
            (_, rows) => resolve(JSON.stringify(rows)),
          );
        },
        (err) => console.log(err),
      ),
    );
  }

  static findOne(id: number): Promise<string> {
    return new Promise((resolve, reject) =>
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT a.id, a.title, a.description, a.day, a.month, a.year, b.id as todo_id, b.description as todo_description, b.done FROM ${this.table} AS a LEFT JOIN todos AS b ON a.id = b.reminder_id where a.id = ?`,
            [id],
            (_, rows) => resolve(JSON.stringify(rows)),
          );
        },
        (err) => console.log(err),
      ),
    );
  }

  static delete(id: number): void {
    this.db.transaction((tx) =>
      tx.executeSql(`DELETE FROM ${this.table} WHERE id = ?`, [id]),
    );
  }

  static update(reminder: Reminder): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) =>
          tx.executeSql(
            `UPDATE ${this.table} set title = ?, description = ?, day = ?, month = ?, year = ? where id = ?`,
            [
              reminder.title,
              reminder.description,
              reminder.day,
              reminder.month,
              reminder.year,
              reminder.id,
            ],
            (_, row) => {
              resolve(row);
            },
          ),
        (err) => {
          console.log(err);
        },
      );
    });
  }
}
