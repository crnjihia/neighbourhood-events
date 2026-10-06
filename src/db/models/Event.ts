import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';
import RSVP from './RSVP';

export default class Event extends Model {
  static table = 'events';
  static associations = {
    rsvps: { type: 'has_many' as const, foreignKey: 'event_id' },
  };

  @field('title') title!: string;
  @field('description') description!: string;
  @field('category') category!: 'tree_planting' | 'blood_donation' | 'cleanup' | 'meetup' | string;
  @field('latitude') latitude!: number;
  @field('longitude') longitude!: number;
  @field('address') address!: string;
  @date('starts_at') startsAt!: Date;
  @date('ends_at') endsAt!: Date;
  @field('organizer_id') organizerId?: string;
  @field('capacity') capacity?: number;
  @field('rsvp_count') rsvpCount?: number;
  @field('image_url') imageUrl?: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('rsvps') rsvps!: any;
}
