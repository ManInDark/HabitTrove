'use client'

import { useCoins } from '@/hooks/useCoins'
import { settingsAtom } from '@/lib/atoms'
import { useAtom } from 'jotai'
import { Coins } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import { Profile } from './Profile'

const TodayEarnedCoins = dynamic(() => import('./TodayEarnedCoins'), { ssr: false })

export default function HeaderActions() {
  const [settings] = useAtom(settingsAtom)
  const { balance } = useCoins()

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link href="/coins" className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors border border-gray-200 dark:border-gray-600">
        <Coins className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-gray-800 dark:text-gray-100 font-medium text-lg">{balance}</span>
          <div className="hidden sm:block">
            <TodayEarnedCoins />
          </div>
        </div>
      </Link>
      <NotificationBell />
      <Profile />
    </div>
  )
}
