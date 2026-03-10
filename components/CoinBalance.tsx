import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import { useTranslations } from 'next-intl';
import TodayEarnedCoins from './TodayEarnedCoins';

export default function CoinBalance({ coinBalance }: { coinBalance: number | undefined }) {
  const t = useTranslations('CoinBalance');

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
              <span className="text-4xl font-bold">{coinBalance ? coinBalance : "…"}</span>
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

