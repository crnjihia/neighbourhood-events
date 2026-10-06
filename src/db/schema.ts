import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'events',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'category', type: 'string' }, // tree_planting|blood_donation|cleanup|meetup
        { name: 'latitude', type: 'number' },
        { name: 'longitude', type: 'number' },
        { name: 'address', type: 'string' },
        { name: 'starts_at', type: 'number' },
        { name: 'ends_at', type: 'number' },
        { name: 'organizer_id', type: 'string', isOptional: true },
        { name: 'capacity', type: 'number', isOptional: true },
        { name: 'rsvp_count', type: 'number', isOptional: true },
        { name: 'image_url', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'push_token', type: 'string', isOptional: true },
        { name: 'notification_categories', type: 'string', isOptional: true }, // JSON string
        { name: 'radius_km', type: 'number', isOptional: true },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'rsvps',
      columns: [
        { name: 'event_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'status', type: 'string' }, // going|interested|declined
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
