import { useHelpers } from '@/lib/client-helpers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItemType } from './Navigation';

export default function NavDisplay({ navItems, isMobile }: { navItems: NavItemType[], isMobile: boolean }) {
  const pathname = usePathname();
  const { isIOS } = useHelpers()

  if (isMobile) {
    return (
        <>
        <div className={isMobile && isIOS ? "pb-20" : "pb-16"} />
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
  } else {
    return (
        <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col h-0 flex-1 bg-gray-800">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                        {navItems.map((item) => (
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
    );
  }
}
