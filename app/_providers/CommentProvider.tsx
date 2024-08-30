'use client'
 
import { CommentType } from '../_components/PostContainer'
import { createContext } from 'react'

type CommentContextType = {
    comment: CommentType;
    setComment: Function;
}
 
export const CommentContext = createContext<CommentContextType | null>(null)

export default function ThemeProvider({
  children, comment, setComment 
}: {
  children: React.ReactNode, 
  comment: CommentType,
  setComment: Function,
}) {

  return <CommentContext.Provider value={{ comment, setComment }}>{children}</CommentContext.Provider>
}