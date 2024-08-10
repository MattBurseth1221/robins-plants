'use client'
 
import { PostType } from '../_components/PostContainer'
import { createContext, useEffect } from 'react'
 
export const PostContext = createContext<PostType | null>(null)

export default function ThemeProvider({
  children, post
}: {
  children: React.ReactNode, 
  post: PostType
}) {

  return <PostContext.Provider value={ post }>{children}</PostContext.Provider>
}