import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import * as schema from './schema'
import { databaseConfig } from '@/configs'

// 确保数据库目录存在
mkdirSync(databaseConfig.databaseDir, { recursive: true })

// 将 Drizzle ORM 连接到数据库
const sqlite = new Database(databaseConfig.databasePath)
export const db = drizzle(sqlite, { schema })

// 每次启动都要迁移
migrate(db, { migrationsFolder: databaseConfig.migrationsFolder })
