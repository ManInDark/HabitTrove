'use client'

import { HabitIcon, TaskIcon } from '@/lib/constants'
import { Calendar, Coins, Gift, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ElementType, useEffect, useState } from 'react'
import DesktopNavDisplay from './DesktopNavDisplay'
import MobileNavDisplay from './MobileNavDisplay'

type ViewPort = 'main' | 'mobile'

export interface NavItemType {
  icon: ElementType;
  label: string;
  href: string;
}

interface NavigationProps {
  position: ViewPort
}

export interface NavDisplayProps {
  navItems: NavItemType[];
}

export default function Navigation({ position: viewPort }: NavigationProps) {
  const t = useTranslations('Navigation')
  const [isMobileView, setIsMobileView] = useState(false)

  const currentNavItems: NavItemType[] = [
    { icon: Home, label: t('dashboard'), href: '/' },
    { icon: HabitIcon, label: t('habits'), href: '/habits' },
    { icon: TaskIcon, label: t('tasks'), href: '/tasks' },
    { icon: Calendar, label: t('calendar'), href: '/calendar' },
    { icon: Gift, label: t('wishlist'), href: '/wishlist' },
    { icon: Coins, label: t('coins'), href: '/coins' },
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (viewPort === 'mobile' && isMobileView) {
    return <MobileNavDisplay navItems={currentNavItems} />
  }

  if (viewPort === 'main' && !isMobileView) {
    return <DesktopNavDisplay navItems={currentNavItems} />
  }

  return null // Explicitly return null if no view matches
}
