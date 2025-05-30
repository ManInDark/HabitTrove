import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CoinTransaction, HabitsData, User, UserData, WishlistData } from '@/lib/types';
import { t2d } from '@/lib/utils';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface NotificationDropdownProps {
  currentUser: User | null;
  unreadNotifications: CoinTransaction[];
  displayedReadNotifications: CoinTransaction[];
  habitsData: HabitsData; 
  wishlistData: WishlistData;
  usersData: UserData;
}

// Helper function to get the name of the related item
const getRelatedItemName = (tx: CoinTransaction, habitsData: HabitsData, wishlistData: WishlistData): string | undefined => {
  if (!tx.relatedItemId) return undefined;
  if (tx.type === 'HABIT_COMPLETION' || tx.type === 'TASK_COMPLETION') {
    return habitsData.habits.find(h => h.id === tx.relatedItemId)?.name;
  }
  if (tx.type === 'WISH_REDEMPTION') {
    return wishlistData.items.find(w => w.id === tx.relatedItemId)?.name;
  }
  return undefined;
};


export default function NotificationDropdown({
  currentUser,
  unreadNotifications, // Use props directly
  displayedReadNotifications, // Use props directly
  habitsData,
  wishlistData,
  usersData,
}: NotificationDropdownProps) {
  const t = useTranslations('NotificationDropdown');

  // Helper function to generate notification message, now using t
  const getNotificationMessage = (tx: CoinTransaction, triggeringUser?: User, relatedItemName?: string): string => {
    const username = triggeringUser?.username || t('defaultUsername');
    const itemName = relatedItemName || t('defaultItemName');
    switch (tx.type) {
      case 'HABIT_COMPLETION':
      case 'TASK_COMPLETION':
        return t('userCompletedItem', { username, itemName });
      case 'WISH_REDEMPTION':
        return t('userRedeemedItem', { username, itemName });
      default:
        return t('activityRelatedToItem', { username, itemName });
    }
  };
  
  if (!currentUser) {
    return <div className="p-4 text-sm text-gray-500">{t('notLoggedIn')}</div>;
  }

  const renderNotification = (tx: CoinTransaction, isUnread: boolean) => {
    const triggeringUser = usersData.users.find(u => u.id === tx.userId);
    const relatedItemName = getRelatedItemName(tx, habitsData, wishlistData);
    const message = getNotificationMessage(tx, triggeringUser, relatedItemName); // Uses the new t-aware helper
    const txTimestamp = t2d({ timestamp: tx.timestamp, timezone: 'UTC' });
    const timeAgo = txTimestamp.toRelative(); 
    const linkHref = `/coins?highlight=${tx.id}${tx.userId ? `&user=${tx.userId}` : ''}`;

    return (
      // Wrap the Link with DropdownMenuItem and use asChild to pass props
      <DropdownMenuItem key={tx.id} asChild className={`p-0 focus:bg-inherit dark:focus:bg-inherit cursor-pointer`}>
        <Link href={linkHref} className={`block hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isUnread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`} scroll={true}>
          <div className="p-3 flex items-start gap-3">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={triggeringUser?.avatarPath ? `/api/avatars/${triggeringUser.avatarPath.split('/').pop()}` : undefined} alt={triggeringUser?.username} />
              <AvatarFallback>{triggeringUser?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className={`text-sm ${isUnread ? 'font-semibold' : ''}`}>{message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</p>
            </div>
          </div>
        </Link>
      </DropdownMenuItem>
    );
  };

  return (
    <TooltipProvider>
      {/* Removed the outer div as width is now set on DropdownMenuContent in NotificationBell */}
      <>
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <h4 className="text-sm font-medium">{t('notificationsTitle')}</h4>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-xs">
                {t('notificationsTooltip')}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <ScrollArea className="h-[400px]">
          {unreadNotifications.length === 0 && displayedReadNotifications.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">{t('noNotificationsYet')}</div>
          )}

          {unreadNotifications.length > 0 && (
            <>
              {unreadNotifications.map(tx => renderNotification(tx, true))}
              {displayedReadNotifications.length > 0 && <Separator className="my-2" />}
            </>
          )}

          {displayedReadNotifications.length > 0 && (
            <>
              {displayedReadNotifications.map(tx => renderNotification(tx, false))}
            </>
          )}
        </ScrollArea>
      </> {/* Close the fragment */}
    </TooltipProvider>
  );
}
