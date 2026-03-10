'use client'

import { coinsAtom, currentUserIdAtom, habitsAtom, wishlistAtom } from '@/lib/atoms'
import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import CoinBalance from './CoinBalance'
import DailyOverview from './DailyOverview'
import HabitStreak from './HabitStreak'

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const [{ habits }] = useAtom(habitsAtom);
  const [loggedInUserId] = useAtom(currentUserIdAtom);
  const [{ transactions }] = useAtom(coinsAtom);
  const [{ items }] = useAtom(wishlistAtom);

  const loggedInUserBalance = loggedInUserId ? transactions.filter(transaction => transaction.userId === loggedInUserId).reduce((sum, transaction) => sum + transaction.amount, 0) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl xs:text-3xl font-bold">{t('title')}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CoinBalance coinBalance={loggedInUserId ? loggedInUserBalance : undefined} />
        <HabitStreak habits={habits} />
        <DailyOverview
          wishlistItems={items}
          habits={habits}
          coinBalance={loggedInUserBalance}
        />
      </div>
    </div>
  )
}

