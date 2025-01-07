import { taskStatusEnum } from '@/configs'
import { z } from 'zod'

export const taskBaseItemSchema = z.object({
  uuid: z.string(),
  startedAt: z.string(),
  updatedAt: z.string(),
  totalCount: z.number(),
  completedCount: z.number(),
  status: z.enum(taskStatusEnum)
})

export const taskImportItemSchema = taskBaseItemSchema.extend({})

export const typesTaskStoreSchema = z.object({
  taskImportList: z.array(taskImportItemSchema)
})
