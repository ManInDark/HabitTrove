import {
  calculateCoinsEarnedToday,
  calculateCoinsSpentToday,
  calculateTotalEarned,
  generateCryptoHash,
  isHabitDue,
  prepareDataForHashing,
  roundToInteger,
  t2d
} from "@/lib/utils";
import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { DateTime } from "luxon";
import {
  BrowserSettings,
  CompletionCache,
  getDefaultCoinsData,
  getDefaultHabitsData,
  getDefaultPublicUsersData,
  getDefaultServerSettings,
  getDefaultSettings,
  getDefaultWishlistData,
  Habit,
  PomodoroAtom,
  UserId
} from "./types";

export const browserSettingsAtom = atomWithStorage('browserSettings', {
  expandedHabits: false,
  expandedTasks: false,
  expandedWishlist: false
} as BrowserSettings)

export const usersAtom = atom(getDefaultPublicUsersData())
export const currentUserIdAtom = atom<UserId | undefined>(undefined);
export const settingsAtom = atom(getDefaultSettings());
export const habitsAtom = atom(getDefaultHabitsData());
export const coinsAtom = atom(getDefaultCoinsData());
export const wishlistAtom = atom(getDefaultWishlistData());
export const serverSettingsAtom = atom(getDefaultServerSettings());
export const userSelectAtom = atom<boolean>(false)
export const aboutOpenAtom = atom<boolean>(false)

export const pomodoroAtom = atom<PomodoroAtom>({
  show: false,
  selectedHabitId: null,
  autoStart: true,
  minimized: false,
})

// Derived atom for coins earned today
export const coinsEarnedTodayAtom = atom((get) => {
  const coins = get(coinsAtom);
  const settings = get(settingsAtom);
  const value = calculateCoinsEarnedToday(coins.transactions, settings.system.timezone);
  return roundToInteger(value);
});

// Derived atom for total earned
export const totalEarnedAtom = atom((get) => {
  const coins = get(coinsAtom);
  const value = calculateTotalEarned(coins.transactions);
  return roundToInteger(value);
});

// Derived atom for coins spent today
export const coinsSpentTodayAtom = atom((get) => {
  const coins = get(coinsAtom);
  const settings = get(settingsAtom);
  const value = calculateCoinsSpentToday(coins.transactions, settings.system.timezone);
  return roundToInteger(value);
});

export const currentUserAtom = atom((get) => {
  const currentUserId = get(currentUserIdAtom);
  const users = get(usersAtom);
  return users.users.find(user => user.id === currentUserId);
})

/**
 * Asynchronous atom that calculates a freshness token (hash) based on the current client-side data.
 * This token can be compared with a server-generated token to detect data discrepancies.
 */
export const clientFreshnessTokenAtom = atom(async (get) => {
  const settings = get(settingsAtom);
  const habits = get(habitsAtom);
  const coins = get(coinsAtom);
  const wishlist = get(wishlistAtom);
  const users = get(usersAtom);

  const dataString = prepareDataForHashing(settings, habits, coins, wishlist, users);
  const hash = await generateCryptoHash(dataString);
  return hash;
});

// Derived atom for completed habits by date, using the cache
export const completedHabitsMapAtom = atom((get) => {
  const habits = get(habitsAtom).habits;
  const completionCache: CompletionCache = {};
  const map = new Map<string, Habit[]>();
  const timezone = get(settingsAtom).system.timezone;

  habits.forEach(habit => {
    habit.completions.forEach(utcTimestamp => {
      const localDate = t2d({ timestamp: utcTimestamp, timezone })
        .toFormat('yyyy-MM-dd');

      if (!completionCache[localDate]) {
        completionCache[localDate] = {};
      }

      completionCache[localDate][habit.id] = (completionCache[localDate][habit.id] || 0) + 1;
    });
  });

  // For each date in the cache
  Object.entries(completionCache).forEach(([dateKey, habitCompletions]) => {
    const completedHabits = habits.filter(habit => {
      const completionsNeeded = habit.targetCompletions || 1;
      const completionsAchieved = habitCompletions[habit.id] || 0;
      return completionsAchieved >= completionsNeeded;
    });

    if (completedHabits.length > 0) {
      map.set(dateKey, completedHabits);
    }
  });

  return map;
});

// Atom family for habits by specific date
export const habitsByDateFamily = atomFamily((dateString: string) =>
  atom((get) => {
    const habits = get(habitsAtom).habits;
    const settings = get(settingsAtom);
    const timezone = settings.system.timezone;

    const date = DateTime.fromISO(dateString).setZone(timezone);
    return habits.filter(habit => isHabitDue({ habit, timezone, date }));
  })
);
