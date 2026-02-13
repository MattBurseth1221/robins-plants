'use client'
 
import { User } from 'lucia'
import { useRouter, useSearchParams } from 'next/navigation'
import { createContext, useEffect } from 'react'
 
export const UserContext = createContext<User | null>(null)

export default function ThemeProvider({
  children, user
}: {
  children: React.ReactNode, 
  user: User | null
}) {
  // const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    if (!user && !window.location.pathname.includes('reset-password')) router.push("/login");
  })

  return <UserContext.Provider value={ user }>{children}</UserContext.Provider>
}