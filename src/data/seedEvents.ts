export interface SeedEvent {
  title: string;
  description: string;
  category: 'tree_planting' | 'cleanup' | 'blood_donation' | 'meetup';
  latitude: number;
  longitude: number;
  address: string;
  startsAtOffsetHours: number; // relative to now for dynamic freshness
  durationHours: number;
  capacity: number;
  rsvpCount: number;
  imageUrl?: string;
}

export const SEED_NAIROBI_EVENTS: SeedEvent[] = [
  // Tree Planting
  {
    title: 'Karura Forest Indigenous Tree Planting & Canopy Restoration',
    description:
      'Join community rangers to plant 1,200 indigenous seedlings (Warburgia & Croton) along Sigiria trail. Seedlings, spades, gloves, and mid-morning Kenyan chai provided by friends of Karura.',
    category: 'tree_planting',
    latitude: -1.2405,
    longitude: 36.8344,
    address: 'Sigiria Gate, Limuru Rd, Karura Forest, Nairobi',
    startsAtOffsetHours: 24,
    durationHours: 4,
    capacity: 120,
    rsvpCount: 68,
  },
  {
    title: 'Ngong Road Forest Green Belt Buffer Planting',
    description:
      'Community tree-planting initiative strengthening the ecological buffer zone around Jamhuri Park and Ngong Forest. Families and youth groups welcome.',
    category: 'tree_planting',
    latitude: -1.3056,
    longitude: 36.7583,
    address: 'Jamhuri Park Gate 2, Ngong Rd, Nairobi',
    startsAtOffsetHours: 72,
    durationHours: 3.5,
    capacity: 80,
    rsvpCount: 42,
  },
  {
    title: 'Nairobi Arboretum Rare Botanicals Nurturing Day',
    description:
      'Pruning, mulching, and planting endangered indigenous flora in the heart of Nairobi. Botanical guides will share tree identification tips.',
    category: 'tree_planting',
    latitude: -1.2758,
    longitude: 36.8042,
    address: 'Nairobi Arboretum, State House Rd, Kilimani',
    startsAtOffsetHours: 120,
    durationHours: 3,
    capacity: 60,
    rsvpCount: 29,
  },

  // River & Beach Cleanups
  {
    title: 'Nairobi River Plastic Interception & Michuki Park Cleanup',
    description:
      'Community waste collection, sorting, and microplastic removal along the Michuki Memorial Park riverbanks. Collected recyclables are handed over to local youth recycling cooperatives.',
    category: 'cleanup',
    latitude: -1.2789,
    longitude: 36.8193,
    address: 'Michuki Memorial Park, Kipande Rd, Nairobi',
    startsAtOffsetHours: 48,
    durationHours: 4,
    capacity: 90,
    rsvpCount: 54,
  },
  {
    title: 'Mathare Riverbank Community Cleanup & Tree Nursery Care',
    description:
      'Hands-on neighbourhood initiative to clear debris from drainage channels and river pathways in Mathare 4A. Gumboots and protective gear provided.',
    category: 'cleanup',
    latitude: -1.2612,
    longitude: 36.8587,
    address: 'Mathare 4A Community Center Bridge, Nairobi',
    startsAtOffsetHours: 96,
    durationHours: 3.5,
    capacity: 75,
    rsvpCount: 37,
  },
  {
    title: 'Nairobi Dam Riparian Zone Waste Interception Drive',
    description:
      'Volunteers unite to clean up perimeter plastic and restore indigenous reeds around the historic Nairobi Dam wetlands.',
    category: 'cleanup',
    latitude: -1.3175,
    longitude: 36.8021,
    address: 'Nairobi Dam Waterfront, Langata / Highrise',
    startsAtOffsetHours: 144,
    durationHours: 4,
    capacity: 65,
    rsvpCount: 31,
  },

  // Blood Donation Days
  {
    title: 'KNBTS National Blood Transfusion Drive Nairobi CBD',
    description:
      'Help save lives across regional hospitals. Certified medical personnel will administer donations. Donor health check, fruit snacks, and recognition certificate provided.',
    category: 'blood_donation',
    latitude: -1.2854,
    longitude: 36.8238,
    address: 'Kencom Plaza Concourse, City Hall Way, Nairobi CBD',
    startsAtOffsetHours: 36,
    durationHours: 6,
    capacity: 200,
    rsvpCount: 94,
  },
  {
    title: 'Kenyatta National Hospital Emergency Blood Drive',
    description:
      'Urgent call for O-negative, A-positive, and universal donors to replenish KNH trauma center blood supplies. Rapid registration on site.',
    category: 'blood_donation',
    latitude: -1.3006,
    longitude: 36.8072,
    address: 'KNH Blood Bank Wing, Hospital Rd, Upper Hill, Nairobi',
    startsAtOffsetHours: 84,
    durationHours: 5,
    capacity: 150,
    rsvpCount: 81,
  },
  {
    title: 'Sarit Centre Community Blood Giving Camp',
    description:
      'Convenient weekend blood donation camp in Westlands in partnership with the Kenya Red Cross Society. Clean, hygienic, and air-conditioned venue.',
    category: 'blood_donation',
    latitude: -1.2608,
    longitude: 36.8037,
    address: 'Sarit Expo Ground Floor, Karuna Rd, Westlands, Nairobi',
    startsAtOffsetHours: 168,
    durationHours: 6,
    capacity: 100,
    rsvpCount: 46,
  },

  // Neighbourhood Meetups
  {
    title: 'Kilimani Neighbourhood Sustainability & Urban Composting Workshop',
    description:
      'Meet your neighbours to learn balcony composting, zero-waste grocery buying, and organic balcony vegetable gardening. Tea and samosas provided.',
    category: 'meetup',
    latitude: -1.2941,
    longitude: 36.7877,
    address: 'Kilimani Community Library, Argwings Kodhek Rd',
    startsAtOffsetHours: 60,
    durationHours: 2.5,
    capacity: 45,
    rsvpCount: 33,
  },
  {
    title: 'Parklands Green Commute & Cycling Safety Meetup',
    description:
      'Neighbourhood breakfast gathering discussing safe urban cycling routes, road-sharing awareness, and upcoming group cycling Sunday rides.',
    category: 'meetup',
    latitude: -1.2639,
    longitude: 36.8197,
    address: 'Diamond Plaza 2 Courtyard, Masari Rd, Parklands',
    startsAtOffsetHours: 108,
    durationHours: 2,
    capacity: 50,
    rsvpCount: 28,
  },
  {
    title: 'Lavington Zero-Waste Swap & Community Skillshare',
    description:
      'Bring pre-loved books, household tools, clothes, and indoor plants to swap! Includes a DIY solar lamp demonstration and kids eco-craft station.',
    category: 'meetup',
    latitude: -1.2778,
    longitude: 36.7694,
    address: 'Lavington Green Gardens, James Gichuru Rd, Nairobi',
    startsAtOffsetHours: 180,
    durationHours: 4,
    capacity: 80,
    rsvpCount: 52,
  },
];
