import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_ITEMS, SEED_NOTIFICATIONS } from "./campusfind-data";
import { FEATURED_LOST_EARBUDS } from "./campusfind-samples";
import { findMatches } from "./campusfind-matching";
import type { CampusItem, CampusNotification } from "./campusfind-types";

const ITEMS_KEY = "campusfind.items.v1";
const NOTIFICATIONS_KEY = "campusfind.notifications.v1";
const INITIAL_ITEMS = [FEATURED_LOST_EARBUDS, ...SEED_ITEMS];

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // A full or unavailable local store should not block reporting in the current session.
  }
}

interface CampusStoreValue {
  items: CampusItem[];
  notifications: CampusNotification[];
  addItem: (item: CampusItem) => number;
  dismissNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markItemResolved: (id: string) => void;
}

const CampusStoreContext = createContext<CampusStoreValue | null>(null);

export function CampusDataProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CampusItem[]>(() => readLocal(ITEMS_KEY, INITIAL_ITEMS));
  const [notifications, setNotifications] = useState<CampusNotification[]>(() =>
    readLocal(NOTIFICATIONS_KEY, SEED_NOTIFICATIONS),
  );

  useEffect(() => writeLocal(ITEMS_KEY, items), [items]);
  useEffect(() => writeLocal(NOTIFICATIONS_KEY, notifications), [notifications]);

  const addItem = useCallback(
    (item: CampusItem) => {
      const matches = findMatches(item, items, { limit: 3 });
      setItems((current) => [item, ...current]);
      if (matches.length > 0) {
        const strongest = matches[0];
        const newNotification: CampusNotification = {
          id: `match-${item.id}`,
          title: "New Match Found!",
          body: `Your ${item.name.toLowerCase()} has a ${strongest.score}% match with a recently ${strongest.item.status} item.`,
          location: strongest.item.location,
          date: strongest.item.date,
          matchScore: strongest.score,
          read: false,
        };
        setNotifications((current) => [newNotification, ...current]);
      }
      return matches.length;
    },
    [items],
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    );
  }, []);

  const markItemResolved = useCallback((id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, resolved: true } : item)));
  }, []);

  const value = useMemo(
    () => ({ items, notifications, addItem, dismissNotification, markNotificationRead, markItemResolved }),
    [items, notifications, addItem, dismissNotification, markNotificationRead, markItemResolved],
  );

  return <CampusStoreContext.Provider value={value}>{children}</CampusStoreContext.Provider>;
}

export function useCampusStore() {
  const value = useContext(CampusStoreContext);
  if (!value) throw new Error("useCampusStore must be used inside CampusDataProvider");
  return value;
}
