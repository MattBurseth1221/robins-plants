'use client'
 
import { User } from 'lucia'
import { createContext } from 'react'
 
export const UserContext = createContext<User | null>(null)
 
export default function ThemeProvider({
  children, user
}: {
  children: React.ReactNode, 
  user: User
}) {
  return <UserContext.Provider value={ user }>{children}</UserContext.Provider>
}