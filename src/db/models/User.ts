import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';
  static associations = {
    rsvps: { type: 'has_many' as const, foreignKey: 'user_id' },
  };

  @field('name') name!: string;
  @field('email') email!: string;
  @field('push_token') pushToken?: string;
  @field('notification_categories') notificationCategories?: string; // JSON string array
  @field('radius_km') radiusKm?: number;
  @field('latitude') latitude?: number;
  @field('longitude') longitude?: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('rsvps') rsvps!: any;
}
