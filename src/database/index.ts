import * as SQLite from 'expo-sqlite';

interface DatabaseConfig {
  getConnection(): SQLite.WebSQLDatabase;
}

export const databaseConnection: DatabaseConfig = {
  getConnection: () => SQLite.openDatabase('database'),
};
