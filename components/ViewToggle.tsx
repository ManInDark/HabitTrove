'use client'

import { browserSettingsAtom, habitsAtom, settingsAtom } from '@/lib/atoms'
import { HabitIcon, TaskIcon } from '@/lib/constants'
import { cn, isHabitDueToday } from '@/lib/utils'
import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { NotificationBadge } from './ui/notification-badge'

interface ViewToggleProps {
  className?: string
}

export function ViewToggle({
  className
}: ViewToggleProps) {
  const t = useTranslations('ViewToggle')
  const [browserSettings, setBrowserSettings] = useAtom(browserSettingsAtom)
  const [habits] = useAtom(habitsAtom)
  const [settings] = useAtom(settingsAtom)
  const pathname = usePathname();
  const router = useRouter();

  const handleViewChange = () => {
    router.push(pathname.includes("habits") ? "/tasks" : "/habits");
  }

  // Calculate due tasks count
  const dueTasksCount = habits.habits.filter(habit => 
    habit.isTask && isHabitDueToday({ habit, timezone: settings.system.timezone })
  ).length

  return (
    <div className={cn('inline-flex rounded-full bg-muted/50 h-8', className)}>
      <div className="relative flex gap-0.5 rounded-full bg-background p-0.5 h-full">
        <button
          onClick={handleViewChange}
          className={cn(
            'relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2',
            pathname.includes('habits') ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <HabitIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{t('habitsLabel')}</span>
        </button>
        <NotificationBadge
          label={dueTasksCount}
          show={dueTasksCount > 0}
          variant={pathname.includes('tasks') ? 'secondary' : 'default'}
          className="shadow-md"
        >
          <button
            onClick={handleViewChange}
            className={cn(
              'relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2',
              pathname.includes('tasks') ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <TaskIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('tasksLabel')}</span>
          </button>
        </NotificationBadge>
        <div
          className={cn(
            'absolute left-0.5 top-0.5 h-[calc(100%-0.25rem)] rounded-full bg-primary transition-transform',
            pathname.includes('habits') ? 'w-[calc(50%-0.125rem)]' : 'w-[calc(50%-0.125rem)] translate-x-[calc(100%+0.125rem)]'
          )}
        />
      </div>
    </div>
  )
}
