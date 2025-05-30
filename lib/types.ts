import { RRule } from "rrule"
import { uuid } from "./utils"
import { DateTime } from "luxon"

export type UserId = string

export type Permission = {
  habit: {
    write: boolean
    interact: boolean
  }
  wishlist: {
    write: boolean
    interact: boolean
  }
  coins: {
    write: boolean
    interact: boolean
  }
}

export type SessionUser = {
  id: UserId
}

export type SafeUser = SessionUser & {
  username: string
  avatarPath?: string
  permissions?: Permission[]
  isAdmin?: boolean
}

export type User = SafeUser & {
  password?: string // Optional: Allow users without passwords (e.g., initial setup)
  lastNotificationReadTimestamp?: string // UTC ISO date string
}

export type Habit = {
  id: string
  name: string
  description: string
  frequency: string
  coinReward: number
  targetCompletions?: number // Optional field, default to 1
  completions: string[] // Array of UTC ISO date strings
  isTask?: boolean // mark the habit as a task
  archived?: boolean // mark the habit as archived
  pinned?: boolean // mark the habit as pinned
  userIds?: UserId[]
}


export type Freq = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type WishlistItemType = {
  id: string
  name: string
  description: string
  coinCost: number
  archived?: boolean // mark the wishlist item as archived
  targetCompletions?: number // Optional field, infinity when unset
  link?: string // Optional URL to external resource
  userIds?: UserId[]
}

export type TransactionType = 'HABIT_COMPLETION' | 'HABIT_UNDO' | 'WISH_REDEMPTION' | 'MANUAL_ADJUSTMENT' | 'TASK_COMPLETION' | 'TASK_UNDO';

export interface CoinTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  timestamp: string;
  relatedItemId?: string;
  note?: string;
  userId?: UserId;
}

export interface UserData {
  users: User[]
}

export interface HabitsData {
  habits: Habit[];
}


export interface CoinsData {
  balance: number;
  transactions: CoinTransaction[];
}

// Default value functions
// Data container types
export interface WishlistData {
  items: WishlistItemType[];
}

// Default value functions
export const getDefaultUsersData = (): UserData => ({
  users: [
    {
      id: uuid(),
      username: 'admin',
      // password: '', // No default password for admin initially? Or set a secure default?
      isAdmin: true,
      lastNotificationReadTimestamp: undefined, // Initialize as undefined
    }
  ]
});

export const getDefaultHabitsData = (): HabitsData => ({
  habits: []
});


export const getDefaultCoinsData = (): CoinsData => ({
  balance: 0,
  transactions: []
});

export const getDefaultWishlistData = (): WishlistData => ({
  items: []
});

export const getDefaultSettings = (): Settings => ({
  ui: {
    useNumberFormatting: true,
    useGrouping: true,
  },
  system: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekStartDay: 1, // Monday
    autoBackupEnabled: true, // Add this line (default to true)
    language: 'en', // Default language
  },
  profile: {}
});

export const getDefaultServerSettings = (): ServerSettings => ({
  isDemo: false
})

// Map of data types to their default values
export const DATA_DEFAULTS = {
  wishlist: getDefaultWishlistData,
  habits: getDefaultHabitsData,
  coins: getDefaultCoinsData,
  settings: getDefaultSettings,
  auth: getDefaultUsersData,
} as const;

// Type for all possible data types
export type DataType = keyof typeof DATA_DEFAULTS;

export interface UISettings {
  useNumberFormatting: boolean;
  useGrouping: boolean;
}

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday

export interface SystemSettings {
  timezone: string;
  weekStartDay: WeekDay;
  autoBackupEnabled: boolean; // Add this line
  language: string; // Add this line for language preference
}

export interface ProfileSettings {
  avatarPath?: string; // deprecated
}

export interface Settings {
  ui: UISettings;
  system: SystemSettings;
  profile: ProfileSettings;
}

export type CompletionCache = {
  [dateKey: string]: {  // dateKey format: "YYYY-MM-DD"
    [habitId: string]: number  // number of completions on that date
  }
}

export interface JotaiHydrateInitialValues {
  settings: Settings;
  coins: CoinsData;
  habits: HabitsData;
  wishlist: WishlistData;
  users: UserData;
  serverSettings: ServerSettings;
}

export interface ServerSettings {
  isDemo: boolean
}

export type ParsedResultType = DateTime<true> | RRule | string | null // null if invalid

// return rrule / datetime (machine-readable frequency), string (human-readable frequency), or null (invalid)
export interface ParsedFrequencyResult {
  message: string | null
  result: ParsedResultType
}
