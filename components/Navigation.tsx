'use client'

import { useHelpers } from '@/lib/client-helpers'
import { HabitIcon, TaskIcon } from '@/lib/constants'
import { Calendar, Coins, Gift, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type ViewPort = 'main' | 'mobile'

interface NavigationProps {
  viewPort: ViewPort
}

export default function Navigation({ viewPort }: NavigationProps) {
  const t = useTranslations('Navigation')
  const [showAbout, setShowAbout] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const { isIOS } = useHelpers()
  const pathname = usePathname();

  const navItems = () => [
    { icon: Home, label: t('dashboard'), href: '/', position: 'main' },
    { icon: HabitIcon, label: t('habits'), href: '/habits', position: 'main' },
    { icon: TaskIcon, label: t('tasks'), href: '/tasks', position: 'main' },
    { icon: Calendar, label: t('calendar'), href: '/calendar', position: 'main' },
    { icon: Gift, label: t('wishlist'), href: '/wishlist', position: 'main' },
    { icon: Coins, label: t('coins'), href: '/coins', position: 'main' },
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
    return (
      <>
        <div className={isIOS ? "pb-20" : "pb-16"} /> {/* Add padding at the bottom to prevent content from being hidden */}
        <nav className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg ${isIOS ? "pb-4" : ""}`}>
          <div className="grid grid-cols-6 w-full">
            {...navItems().map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={"flex flex-col items-center py-2 hover:text-blue-600 dark:hover:text-blue-300 " +
                  (pathname === (item.href) ?
                    "text-blue-500 dark:text-blue-500" :
                    "text-gray-300 dark:text-gray-300")
                }
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </>
    )
  }

  if (viewPort === 'main' && !isMobileView) {
    return (
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navItems().filter(item => item.position === 'main').map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={"flex items-center px-2 py-2 font-medium rounded-md " +
                      (pathname === (item.href) ?
                        "text-blue-500 hover:text-blue-600 hover:bg-gray-700" :
                        "text-gray-300 hover:text-white hover:bg-gray-700")}
                  >
                    <item.icon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
