/* eslint-disable no-console */
import { databaseConnection } from './index';

export const databaseInit: () => boolean = () => {
  const db = databaseConnection.getConnection();
  db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
    console.log('Foreign keys turned on'),
  );
  const sqls = [
    `DROP TABLE IF EXISTS todos;`,
    `DROP TABLE IF EXISTS reminders;`,
    `DROP TABLE IF EXISTS schedules;`,
    `CREATE TABLE IF NOT EXISTS reminders(
      id integer primary key autoincrement,
      title text NOT NULL,
      description text,
      month integer NOT NULL,
      year integer NOT NULL,
      day integer NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS schedules(
      id integer primary key autoincrement,
      title text NOT NULL,
      description text,
      month integer NOT NULL,
      year integer NOT NULL,
      day integer NOT NULL,
      timestamp text NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS todos(
      id integer primary key autoincrement,
      description text NOT NULL,
      done int NOT NULL,
      schedule_id integer,
      reminder_id integer,
      foreign key (schedule_id) references schedules(id),
      foreign key (reminder_id) references reminders(id)
    );`,
    // `
    // INSERT INTO schedules(title, description, month, year, day, timestamp) VALUES ('fasdfgasd', 'idfpsua', 1, 2021, 1, 1523513513);
    // `,
  ];
  let dbUp = false;
  db.transaction(
    (tx) => {
      sqls.forEach((sql) => {
        tx.executeSql(sql, []);
      });
    },
    (err) => {
      console.log(err);
    },
    () => {
      console.log('Sucess to init the database.');
      dbUp = true;
    },
  );
  return dbUp;
};
