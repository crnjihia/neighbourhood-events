import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import Event from './Event';
import User from './User';

export default class RSVP extends Model {
  static table = 'rsvps';
  static associations = {
    events: { type: 'belongs_to' as const, key: 'event_id' },
    users: { type: 'belongs_to' as const, key: 'user_id' },
  };

  @field('event_id') eventId!: string;
  @field('user_id') userId!: string;
  @field('status') status!: 'going' | 'interested' | 'declined' | string;
  @readonly @date('created_at') createdAt!: Date;

  @relation('events', 'event_id') event!: any;
  @relation('users', 'user_id') user!: any;
}
