import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  @field('name') name!: string;
  @field('email') email!: string;
  @field('push_token') pushToken!: string;
  @field('notification_categories') notificationCategories!: string; // JSON string
  @field('radius_km') radiusKm!: number;
  @field('latitude') latitude!: number;
  @field('longitude') longitude!: number;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
