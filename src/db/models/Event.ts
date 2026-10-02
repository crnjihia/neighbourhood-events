import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class Event extends Model {
  static table = 'events';

  @field('title') title!: string;
  @field('description') description!: string;
  @field('category') category!: string;
  @field('latitude') latitude!: number;
  @field('longitude') longitude!: number;
  @field('address') address!: string;
  @date('starts_at') startsAt!: Date;
  @date('ends_at') endsAt!: Date;
  @field('organizer_id') organizerId!: string;
  @field('capacity') capacity!: number;
  @field('rsvp_count') rsvpCount!: number;
  @field('image_url') imageUrl!: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
