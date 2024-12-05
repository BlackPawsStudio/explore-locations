export type RouteType = "airports" | "flying_routes" | "driving_routes";

export function getSiteUrl(): string {
  return process.env.SITE_URL || "localhost:3000";
}

export function getItemsPerPage(): number {
  return 5000;
}
