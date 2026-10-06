import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface WatermelonSyncChanges {
  events?: {
    created?: any[];
    updated?: any[];
    deleted?: string[];
  };
  users?: {
    created?: any[];
    updated?: any[];
    deleted?: string[];
  };
  rsvps?: {
    created?: any[];
    updated?: any[];
    deleted?: string[];
  };
}

export interface PullChangesResult {
  changes: {
    events: { created: any[]; updated: any[]; deleted: string[] };
    users: { created: any[]; updated: any[]; deleted: string[] };
    rsvps: { created: any[]; updated: any[]; deleted: string[] };
  };
  timestamp: number;
}

export async function pullChanges(lastPulledAt: number): Promise<PullChangesResult> {
  const currentTimestamp = Date.now();
  const lastPulledDate = new Date(lastPulledAt || 0);

  // Pull events updated or created since lastPulledDate
  const allEvents = await prisma.event.findMany({
    where: {
      updatedAt: { gt: lastPulledDate },
    },
  });

  const eventsCreated: any[] = [];
  const eventsUpdated: any[] = [];

  for (const ev of allEvents) {
    const formatted = {
      id: ev.id,
      title: ev.title,
      description: ev.description,
      category: ev.category,
      latitude: ev.latitude,
      longitude: ev.longitude,
      address: ev.address,
      starts_at: ev.startsAt.getTime(),
      ends_at: ev.endsAt.getTime(),
      organizer_id: ev.organizerId,
      capacity: ev.capacity,
      rsvp_count: ev.rsvpCount,
      image_url: ev.imageUrl,
      created_at: ev.createdAt.getTime(),
      updated_at: ev.updatedAt.getTime(),
    };

    if (ev.createdAt > lastPulledDate) {
      eventsCreated.push(formatted);
    } else {
      eventsUpdated.push(formatted);
    }
  }

  // Pull RSVPs updated or created since lastPulledDate
  const allRsvps = await prisma.rSVP.findMany({
    where: {
      createdAt: { gt: lastPulledDate },
    },
  });

  const rsvpsCreated = allRsvps.map(rsvp => ({
    id: rsvp.id,
    event_id: rsvp.eventId,
    user_id: rsvp.userId,
    status: rsvp.status,
    created_at: rsvp.createdAt.getTime(),
  }));

  return {
    changes: {
      events: { created: eventsCreated, updated: eventsUpdated, deleted: [] },
      users: { created: [], updated: [], deleted: [] },
      rsvps: { created: rsvpsCreated, updated: [], deleted: [] },
    },
    timestamp: currentTimestamp,
  };
}

export async function pushChanges(
  changes: WatermelonSyncChanges,
  lastPulledAt: number,
): Promise<{ success: boolean; timestamp: number }> {
  const currentTimestamp = Date.now();

  // 1. Process RSVPs
  if (changes.rsvps) {
    const { created = [], updated = [], deleted = [] } = changes.rsvps;

    for (const rsvp of created) {
      // Upsert RSVP
      await prisma.rSVP.upsert({
        where: { id: rsvp.id },
        create: {
          id: rsvp.id,
          eventId: rsvp.event_id || rsvp.eventId,
          userId: rsvp.user_id || rsvp.userId,
          status: rsvp.status || 'going',
          createdAt: rsvp.created_at ? new Date(rsvp.created_at) : new Date(),
        },
        update: {
          status: rsvp.status || 'going',
        },
      });
    }

    for (const rsvp of updated) {
      await prisma.rSVP.update({
        where: { id: rsvp.id },
        data: {
          status: rsvp.status,
        },
      }).catch(() => {});
    }

    for (const rsvpId of deleted) {
      await prisma.rSVP.delete({
        where: { id: rsvpId },
      }).catch(() => {});
    }
  }

  // 2. Process Events
  if (changes.events) {
    const { created = [], updated = [], deleted = [] } = changes.events;

    for (const ev of created) {
      await prisma.event.upsert({
        where: { id: ev.id },
        create: {
          id: ev.id,
          title: ev.title,
          description: ev.description || '',
          category: ev.category || 'meetup',
          latitude: Number(ev.latitude) || -1.2921,
          longitude: Number(ev.longitude) || 36.8219,
          address: ev.address || 'Nairobi',
          startsAt: ev.starts_at ? new Date(ev.starts_at) : new Date(),
          endsAt: ev.ends_at ? new Date(ev.ends_at) : new Date(Date.now() + 7200000),
          organizerId: ev.organizer_id || null,
          capacity: ev.capacity ? Number(ev.capacity) : null,
          rsvpCount: ev.rsvp_count ? Number(ev.rsvp_count) : 0,
          imageUrl: ev.image_url || null,
        },
        update: {
          title: ev.title,
          description: ev.description,
          category: ev.category,
          latitude: Number(ev.latitude),
          longitude: Number(ev.longitude),
          address: ev.address,
        },
      });
    }

    for (const ev of updated) {
      // Server conflict resolution: if server record was updated after lastPulledAt, reject or keep server
      const existing = await prisma.event.findUnique({ where: { id: ev.id } });
      if (existing && existing.updatedAt.getTime() <= lastPulledAt) {
        await prisma.event.update({
          where: { id: ev.id },
          data: {
            title: ev.title,
            description: ev.description,
            category: ev.category,
            latitude: Number(ev.latitude),
            longitude: Number(ev.longitude),
            address: ev.address,
          },
        }).catch(() => {});
      }
    }

    for (const id of deleted) {
      await prisma.event.delete({ where: { id } }).catch(() => {});
    }
  }

  return { success: true, timestamp: currentTimestamp };
}
