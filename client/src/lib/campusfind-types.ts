export const CATEGORIES = [
  "Electronics",
  "Bags",
  "Accessories",
  "Books",
  "Keys",
  "Clothing",
  "ID/Cards",
  "Stationery",
  "Personal Items",
  "Other",
] as const;

export const LOCATIONS = [
  "Library",
  "Cafeteria",
  "Main Block",
  "Parking Area",
  "Hostel",
  "Sports Ground",
  "Computer Lab",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type ItemStatus = "lost" | "found";

export interface CampusItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  status: ItemStatus;
  location: string;
  date: string;
  time: string;
  color: string;
  reporter: string;
  initials: string;
  photo?: string;
  postedAt: string;
  resolved?: boolean;
}

export interface MatchScore {
  item: CampusItem;
  score: number;
  categoryScore: number;
  locationScore: number;
  dateScore: number;
}

export interface CampusNotification {
  id: string;
  title: string;
  body: string;
  location: string;
  date: string;
  matchScore: number;
  read: boolean;
  dismissed?: boolean;
}

export interface StudentProfile {
  name: string;
  department: string;
  year: string;
  initials: string;
}
