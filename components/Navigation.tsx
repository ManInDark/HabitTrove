'use client'

import { HabitIcon, TaskIcon } from '@/lib/constants'
import { Calendar, Coins, Gift, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ElementType } from 'react'
import NavDisplay from './NavDisplay'

export interface NavItemType {
  icon: ElementType;
  label: string;
  href: string;
}

export default function Navigation({ position }: { position: 'main' | 'mobile' }) {
  const t = useTranslations('Navigation');

  const currentNavItems: NavItemType[] = [
    { icon: Home, label: t('dashboard'), href: '/' },
    { icon: HabitIcon, label: t('habits'), href: '/habits' },
    { icon: TaskIcon, label: t('tasks'), href: '/tasks' },
    { icon: Calendar, label: t('calendar'), href: '/calendar' },
    { icon: Gift, label: t('wishlist'), href: '/wishlist' },
    { icon: Coins, label: t('coins'), href: '/coins' },
  ]

  return <NavDisplay navItems={currentNavItems} displayType={position} />
}
