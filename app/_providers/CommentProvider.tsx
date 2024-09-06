//NOT USED ANYMORE

import { CommentType } from '../_components/PostContainer'
import { createContext } from 'react'

export type CommentContextType = {
    comments: CommentType[];
    setComments: Function;
}
 
export const CommentContext = createContext<CommentContextType>({comments: [], setComments: () => {}});

export default function ThemeProvider({
  children, comments, setComments
}: {
  children: React.ReactNode, 
  comments: CommentType[],
  setComments: Function,
}) {

  return <CommentContext.Provider value={{ comments, setComments }}>{children}</CommentContext.Provider>
}