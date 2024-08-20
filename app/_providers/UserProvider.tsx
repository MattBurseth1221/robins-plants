'use client'
 
import { User } from 'lucia'
import { useRouter } from 'next/navigation'
import { createContext, useEffect } from 'react'
 
export const UserContext = createContext<User | null>(null)

export default function ThemeProvider({
  children, user
}: {
  children: React.ReactNode, 
  user: User
}) {
  const router = useRouter();
  useEffect(() => {
    if (!user) router.push("/login");
  })

  return <UserContext.Provider value={ user }>{children}</UserContext.Provider>
}