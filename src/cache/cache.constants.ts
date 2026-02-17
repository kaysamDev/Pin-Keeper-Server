export const CACHE_KEYS = {
  // Categories
  CATEGORIES_ALL: 'categories:all',
  CATEGORY_BY_ID: (id: string) => `categories:${id}`,

  // Tags
  TAGS_ALL: 'tags:all',
  TAG_BY_ID: (id: string) => `tags:${id}`,

  // Locations
  LOCATIONS_ALL: 'locations:all',
  LOCATION_BY_ID: (id: string) => `locations:${id}`,

  // Collections (user-specific)
  COLLECTIONS_BY_USER: (userId: string) => `collections:user:${userId}`,
  COLLECTION_BY_ID: (id: string) => `collections:${id}`,
};

export const CACHE_TTL = {
  SHORT: 30 * 1000, // 30 seconds
  DEFAULT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
};
