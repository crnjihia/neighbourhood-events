import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { mySchema } from './schema';
import Event from './models/Event';
import User from './models/User';
import RSVP from './models/RSVP';

/*
  Web-specific database instance using LokiJSAdapter + browser IndexedDB.
  Completely avoids importing native SQLite / better-sqlite3 in web bundles.
*/
const adapter = new LokiJSAdapter({
  schema: mySchema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
});

export const database = new Database({
  adapter,
  modelClasses: [Event, User, RSVP],
});
