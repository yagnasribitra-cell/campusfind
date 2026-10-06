import type { CampusItem, ItemStatus, MatchScore } from "./campusfind-types";

const CAMPUS_LOCATION_GROUPS: string[][] = [
  ["library", "central library", "library annex", "reading wing", "learning commons"],
  ["cafeteria", "student cafe", "student café", "cafe", "café"],
  ["main block", "main building", "admin block"],
  ["parking area", "parking lot", "car park"],
  ["hostel", "residence hall", "dorm"],
  ["sports ground", "sports field", "athletics ground"],
  ["computer lab", "computing lab", "it lab"],
];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function locationPoints(first: string, second: string): number {
  const a = normalize(first);
  const b = normalize(second);
  if (a === b) return 35;

  const related = CAMPUS_LOCATION_GROUPS.some((group) => {
    const matchesA = group.some((alias) => a === alias || a.includes(alias));
    const matchesB = group.some((alias) => b === alias || b.includes(alias));
    return matchesA && matchesB;
  });

  return related ? 29 : 0;
}

function datePoints(first: string, second: string): number {
  const firstDay = new Date(`${first}T12:00:00`).getTime();
  const secondDay = new Date(`${second}T12:00:00`).getTime();
  if (!Number.isFinite(firstDay) || !Number.isFinite(secondDay)) return 0;
  const days = Math.abs(Math.round((firstDay - secondDay) / 86_400_000));
  if (days === 0) return 25;
  if (days === 1) return 20;
  if (days <= 3) return 12;
  return 0;
}

export function scoreItems(first: CampusItem, second: CampusItem): MatchScore | null {
  if (first.status === second.status || first.category !== second.category) return null;

  const categoryScore = 40;
  const locationScore = locationPoints(first.location, second.location);
  const dateScore = datePoints(first.date, second.date);
  const score = categoryScore + locationScore + dateScore;

  if (score <= 0) return null;
  return { item: second, score, categoryScore, locationScore, dateScore };
}

export function findMatches(
  item: CampusItem,
  items: CampusItem[],
  options: { limit?: number; oppositeStatus?: ItemStatus } = {},
): MatchScore[] {
  const desiredStatus = options.oppositeStatus ?? (item.status === "lost" ? "found" : "lost");

  return items
    .filter((candidate) => candidate.id !== item.id && !candidate.resolved && candidate.status === desiredStatus)
    .map((candidate) => scoreItems(item, candidate))
    .filter((result): result is MatchScore => result !== null)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, options.limit ?? Number.POSITIVE_INFINITY);
}
