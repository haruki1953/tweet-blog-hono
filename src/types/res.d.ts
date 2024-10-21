export interface ResData {
  code: number
  message: string
  data?: any
  token?: string
}

export interface Post {
  id: number
  createdAt: Date
  addedAt: Date
  content: string
  isDeleted: boolean
  parentPostId: number | null
  twitterId: string | null
  twitterLink: string | null
  images: Image[]
  imagesOrder: string | null
  _count: {
    replies: number
  }
}

export interface Image {
  id: number
  alt: string | null
  path: string
  addedAt: Date
  smallSize: number
  largeSize: number
  originalSize: number
  originalPath: string | null
  twitterLargeImageLink: string | null
}

export type PostGetByIdData = Post & {
  parentPost: Post | null
  replies: Array<Post & {
    replies: Post[]
  }>
}

export type PostGetByCursorData = Array<Post & {
  parentPost: Post | null
}>
