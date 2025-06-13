import Link from 'next/link'
import { NavDisplayProps, NavItemType } from './Navigation';
import { usePathname } from 'next/navigation';
import { useHelpers } from '@/lib/client-helpers';

export default function MobileNavDisplay({ navItems }: NavDisplayProps) {
  const pathname = usePathname();
  const { isIOS } = useHelpers()

  return (
    <>
      <div className={isIOS ? "pb-20" : "pb-16"} />
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg ${isIOS ? "pb-4" : ""}`}>
        <div className="grid grid-cols-6 w-full">
          {navItems.map((item) => (
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
  );
}
