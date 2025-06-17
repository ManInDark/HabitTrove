'use client'

import { HabitIcon, TaskIcon } from '@/lib/constants'
import { Calendar, Coins, Gift, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ElementType, useEffect, useState } from 'react'
import NavDisplay from './NavDisplay'

export interface NavItemType {
  icon: ElementType;
  label: string;
  href: string;
}

export default function Navigation({ position }: { position: 'main' | 'mobile' }) {
  const t = useTranslations('Navigation');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {setIsMobile(window.innerWidth < 1024); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  const currentNavItems: NavItemType[] = [
    { icon: Home, label: t('dashboard'), href: '/' },
    { icon: HabitIcon, label: t('habits'), href: '/habits' },
    { icon: TaskIcon, label: t('tasks'), href: '/tasks' },
    { icon: Calendar, label: t('calendar'), href: '/calendar' },
    { icon: Gift, label: t('wishlist'), href: '/wishlist' },
    { icon: Coins, label: t('coins'), href: '/coins' },
  ]

  if ((position === 'mobile' && isMobile) || (position === 'main' && !isMobile)) {
    return <NavDisplay navItems={currentNavItems} isMobile={isMobile} />
  }
  else {
    return <></>
  }
}
