import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { mySchema } from './schema';
import Event from './models/Event';
import User from './models/User';
import RSVP from './models/RSVP';

/*
  WatermelonDB database instance.
  Uses the SQLite adapter (expo-sqlite) to store data locally.
*/
const adapter = new SQLiteAdapter({
  schema: mySchema,
});

export const database = new Database({
  adapter,
  modelClasses: [Event, User, RSVP],
});
