import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { settingsAtom } from '@/lib/atoms'
import { useAtom } from 'jotai'
import { Coins } from 'lucide-react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

const TodayEarnedCoins = dynamic(() => import('./TodayEarnedCoins'), { ssr: false })

export default function CoinBalance({ coinBalance }: { coinBalance: number }) {
  const t = useTranslations('CoinBalance');
  const [settings] = useAtom(settingsAtom)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('coinBalanceTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <Coins className="h-12 w-12 text-yellow-400 mr-4" />
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="text-4xl font-bold">{coinBalance}</span>
              <div className="flex items-center gap-1">
                <TodayEarnedCoins longFormat={true} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

