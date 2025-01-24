import { sqliteTable, text, integer, primaryKey, unique, boolean, date, default as sqlDefault } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const Post = sqliteTable('Post', {
  id: text('id').primaryKey().default(sqlDefault('uuid_generate_v4')),
  createdAt: date('createdAt').notNull().default(sqlDefault('CURRENT_TIMESTAMP')),
  addedAt: date('addedAt').notNull().default(sqlDefault('CURRENT_TIMESTAMP')),
  content: text('content').notNull(),
  isDeleted: boolean('isDeleted').notNull().default(false),
  imagesOrder: text('imagesOrder'),
  parentPostId: text('parentPostId')
})

export const PostRelations = relations(Post, ({ one, many }) => ({
  parentPost: one(Post, { fields: [Post.parentPostId], references: [Post.id] }),
  replies: many(Post),
  images: many(Image),
  postForwards: many(PostForward),
  postImports: many(PostImport)
}))

export const PostForward = sqliteTable('PostForward', {
  id: text('id').primaryKey().default(sqlDefault('uuid_generate_v4')),
  platform: text('platform').notNull(),
  platformPostId: text('platformPostId').notNull(),
  link: text('link').notNull(),
  forwardAt: date('forwardAt').notNull().default(sqlDefault('CURRENT_TIMESTAMP')),
  forwardConfigId: text('forwardConfigId').notNull(),
  postId: text('postId').notNull()
})

export const PostForwardRelations = relations(PostForward, ({ one }) => ({
  post: one(Post, { fields: [PostForward.postId], references: [Post.id], onDelete: 'cascade' })
}))

export const PostImport = sqliteTable('PostImport', {
  id: text('id').primaryKey().default(sqlDefault('uuid_generate_v4')),
  platform: text('platform').notNull(),
  platformPostId: text('platformPostId').notNull(),
  link: text('link').notNull(),
  importedAt: date('importedAt').notNull().default(sqlDefault('CURRENT_TIMESTAMP')),
  postId: text('postId').notNull()
})

export const PostImportRelations = relations(PostImport, ({ one }) => ({
  post: one(Post, { fields: [PostImport.postId], references: [Post.id], onDelete: 'cascade' })
}))

export const Image = sqliteTable('Image', {
  id: text('id').primaryKey().default(sqlDefault('uuid_generate_v4')),
  alt: text('alt'),
  path: text('path').notNull(),
  addedAt: date('addedAt').notNull().default(sqlDefault('CURRENT_TIMESTAMP')),
  smallSize: integer('smallSize').notNull().default(0),
  largeSize: integer('largeSize').notNull().default(0),
  originalSize: integer('originalSize').notNull().default(0),
  originalPath: text('originalPath')
})

export const ImageRelations = relations(Image, ({ many }) => ({
  posts: many(Post),
  imageImports: many(ImageImport),
  imageForwards: many(ImageForward)
}))

export const ImageForward = sqliteTable('ImageForward', {
  id: text('id').primaryKey().default(sqlDefault('uuid_generate_v4')),
  platform: text('platform').notNull(),
  platformImageId: text('platformImageId').notNull(),
  link: text('link').notNull(),
  forwardAt: date('forwardAt').notNull().default(sqlDefault('CURRENT_TIMESTAMP')),
  forwardConfigId: text('forwardConfigId').notNull(),
  imageId: text('imageId').notNull()
})

export const ImageForwardRelations = relations(ImageForward, ({ one }) => ({
  image: one(Image, { fields: [ImageForward.imageId], references: [Image.id], onDelete: 'cascade' })
}))

export const ImageImport = sqliteTable('ImageImport', {
  id: text('id').primaryKey().default(sqlDefault('uuid_generate_v4')),
  platform: text('platform').notNull(),
  platformImageId: text('platformImageId').notNull(),
  link: text('link').notNull(),
  importedAt: date('importedAt').notNull().default(sqlDefault('CURRENT_TIMESTAMP')),
  imageId: text('imageId').notNull()
})

export const ImageImportRelations = relations(ImageImport, ({ one }) => ({
  image: one(Image, { fields: [ImageImport.imageId], references: [Image.id], onDelete: 'cascade' })
}))

export const Log = sqliteTable('Log', {
  id: text('id').primaryKey().default(sqlDefault('uuid_generate_v4')),
  title: text('title'),
  content: text('content').notNull(),
  type: text('type').notNull(),
  createdAt: date('createdAt').notNull().default(sqlDefault('CURRENT_TIMESTAMP'))
})
