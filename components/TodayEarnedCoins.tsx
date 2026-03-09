import { useCoins } from '@/hooks/useCoins'
import { useTranslations } from 'next-intl'

export default function TodayEarnedCoins({ longFormat }: { longFormat?: boolean }) {
  const t = useTranslations('TodayEarnedCoins')
  const { coinsEarnedToday } = useCoins()

  if (coinsEarnedToday <= 0) return <></>;

  return (
    <span className="text-md text-green-600 dark:text-green-400 font-medium mt-1">
      {"+"}{coinsEarnedToday}
      {longFormat ?
        <span className="text-sm text-muted-foreground"> {t('todaySuffix')}</span>
        : null}
    </span>
  )
}
