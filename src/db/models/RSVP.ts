import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class RSVP extends Model {
  static table = 'rsvps';

  @field('event_id') eventId!: string;
  @field('user_id') userId!: string;
  @field('status') status!: string; // going|interested|declined
  @date('created_at') createdAt!: Date;
}
