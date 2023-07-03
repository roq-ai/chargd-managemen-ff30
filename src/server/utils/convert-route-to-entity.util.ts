const mapping: Record<string, string> = {
  'ev-chargers': 'ev_charger',
  organizations: 'organization',
  'usage-statistics': 'usage_statistics',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
