'use client'

import { aboutOpenAtom, currentUserIdAtom, pomodoroAtom, userSelectAtom } from '@/lib/atoms';
import { useAtom, useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'
import AboutModal from './AboutModal'
import LoadingSpinner from './LoadingSpinner'
import PomodoroTimer from './PomodoroTimer'
import UserSelectModal from './UserSelectModal'

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [pomo] = useAtom(pomodoroAtom)
  const [userSelect, setUserSelect] = useAtom(userSelectAtom)
  const [aboutOpen, setAboutOpen] = useAtom(aboutOpenAtom)
  const setCurrentUserIdAtom = useSetAtom(currentUserIdAtom)
  const { data: session, status } = useSession()
  const currentUserId = session?.user.id
  const [isMounted, setIsMounted] = useState(false);

  // block client-side hydration until mounted (this is crucial to wait for all jotai atoms to load), to prevent SSR hydration errors in the children components
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'loading') return
    if (!currentUserId && !userSelect) {
      setUserSelect(true)
    }
  }, [currentUserId, status, userSelect, setUserSelect])

  useEffect(() => {
    setCurrentUserIdAtom(currentUserId)
  }, [currentUserId, setCurrentUserIdAtom])

  if (!isMounted) {
    return <LoadingSpinner />
  }
  return (
    <>
      {children}
      {pomo.show && (
        <PomodoroTimer />
      )}
      {userSelect && (
        <UserSelectModal onClose={() => setUserSelect(false)} />
      )}
      {aboutOpen && (
        <AboutModal onClose={() => setAboutOpen(false)} />
      )}
    </>
  )
}
