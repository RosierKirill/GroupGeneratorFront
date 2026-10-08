import { database } from '../database'
import type { Skill } from '../entities'

const findAllQuery = database.query<Skill, []>('SELECT id, name, value FROM Skills ORDER BY id')

export const SkillModel = {
  findAll: async (): Promise<Skill[]> => findAllQuery.all(),
}
