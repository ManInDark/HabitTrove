import { notFound } from 'next/navigation';
import { ReactNode } from "react";

export default function Debug({children}: {children: ReactNode}) {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  return (
    <div className="debug">
      {children}
    </div>
  )
}