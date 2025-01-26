import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// Posts table
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().$default(() => crypto.randomUUID()),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
  addedAt: integer('added_at', { mode: 'timestamp' }).notNull().defaultNow(),
  content: text('content').notNull(),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).notNull().default(false),
  imagesOrder: text('images_order'),
  parentPostId: text('parent_post_id')
})

export const postsRelations = relations(posts, ({ many, one }) => ({
  images: many(images, { relationName: 'PostImages' }),
  parentPost: one(posts, {
    fields: [posts.parentPostId],
    references: [posts.id],
    relationName: 'PostReplies'
  }),
  replies: many(posts, {
    relationName: 'PostReplies'
  }),
  postForwards: many(postForwards, { relationName: 'PostForwards' }),
  postImports: many(postImports, { relationName: 'PostImports' })
}))

// PostForward table
export const postForwards = sqliteTable('post_forwards', {
  id: text('id').primaryKey().$default(() => crypto.randomUUID()),
  platform: text('platform').notNull(),
  platformPostId: text('platform_post_id').notNull(),
  link: text('link').notNull(),
  forwardAt: integer('forward_at', { mode: 'timestamp' }).notNull().defaultNow(),
  forwardConfigId: text('forward_config_id').notNull(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' })
})

export const postForwardsRelations = relations(postForwards, ({ one }) => ({
  post: one(posts, {
    fields: [postForwards.postId],
    references: [posts.id],
    relationName: 'PostForwards'
  })
}))

// PostImport table
export const postImports = sqliteTable('post_imports', {
  id: text('id').primaryKey().$default(() => crypto.randomUUID()),
  platform: text('platform').notNull(),
  platformPostId: text('platform_post_id').notNull(),
  link: text('link').notNull(),
  importedAt: integer('imported_at', { mode: 'timestamp' }).notNull().defaultNow(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' })
})

export const postImportsRelations = relations(postImports, ({ one }) => ({
  post: one(posts, {
    fields: [postImports.postId],
    references: [posts.id],
    relationName: 'PostImports'
  })
}))

// Image table
export const images = sqliteTable('images', {
  id: text('id').primaryKey().$default(() => crypto.randomUUID()),
  alt: text('alt'),
  path: text('path').notNull(),
  addedAt: integer('added_at', { mode: 'timestamp' }).notNull().defaultNow(),
  smallSize: integer('small_size').notNull().default(0),
  largeSize: integer('large_size').notNull().default(0),
  originalSize: integer('original_size').notNull().default(0),
  originalPath: text('original_path')
})

export const imagesRelations = relations(images, ({ many }) => ({
  posts: many(posts, { relationName: 'PostImages' }),
  imageImports: many(imageImports, { relationName: 'ImageImports' }),
  imageForwards: many(imageForwards, { relationName: 'ImageForwards' })
}))

// ImageForward table
export const imageForwards = sqliteTable('image_forwards', {
  id: text('id').primaryKey().$default(() => crypto.randomUUID()),
  platform: text('platform').notNull(),
  platformImageId: text('platform_image_id').notNull(),
  link: text('link').notNull(),
  forwardAt: integer('forward_at', { mode: 'timestamp' }).notNull().defaultNow(),
  forwardConfigId: text('forward_config_id').notNull(),
  imageId: text('image_id').notNull().references(() => images.id, { onDelete: 'cascade' })
})

export const imageForwardsRelations = relations(imageForwards, ({ one }) => ({
  image: one(images, {
    fields: [imageForwards.imageId],
    references: [images.id],
    relationName: 'ImageForwards'
  })
}))

// ImageImport table
export const imageImports = sqliteTable('image_imports', {
  id: text('id').primaryKey().$default(() => crypto.randomUUID()),
  platform: text('platform').notNull(),
  platformImageId: text('platform_image_id').notNull(),
  link: text('link').notNull(),
  importedAt: integer('imported_at', { mode: 'timestamp' }).notNull().defaultNow(),
  imageId: text('image_id').notNull().references(() => images.id, { onDelete: 'cascade' })
})

export const imageImportsRelations = relations(imageImports, ({ one }) => ({
  image: one(images, {
    fields: [imageImports.imageId],
    references: [images.id],
    relationName: 'ImageImports'
  })
}))

// Log table
export const logs = sqliteTable('logs', {
  id: text('id').primaryKey().$default(() => crypto.randomUUID()),
  title: text('title'),
  content: text('content').notNull(),
  type: text('type').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
})
