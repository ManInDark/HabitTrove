'use client'

import { HabitIcon, TaskIcon } from '@/lib/constants'
import { Calendar, Coins, Gift, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ElementType, useEffect, useState } from 'react'
import NavDisplay from './NavDisplay'

type ViewPort = 'main' | 'mobile'

export interface NavItemType {
  icon: ElementType;
  label: string;
  href: string;
}

interface NavigationProps {
  position: ViewPort
}

export default function Navigation({ position: viewPort }: NavigationProps) {
  const t = useTranslations('Navigation')

  const currentNavItems: NavItemType[] = [
    { icon: Home, label: t('dashboard'), href: '/' },
    { icon: HabitIcon, label: t('habits'), href: '/habits' },
    { icon: TaskIcon, label: t('tasks'), href: '/tasks' },
    { icon: Calendar, label: t('calendar'), href: '/calendar' },
    { icon: Gift, label: t('wishlist'), href: '/wishlist' },
    { icon: Coins, label: t('coins'), href: '/coins' },
  ]

  return <NavDisplay navItems={currentNavItems} isMobile={viewPort === 'mobile'} />
}
