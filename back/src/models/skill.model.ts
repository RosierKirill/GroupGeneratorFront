import { database } from '../database'
import type { Skill } from '../entities'

const findAllQuery = database.query<Skill, []>(`SELECT id, name, value FROM Skills ORDER BY id`)
const findByIdQuery = database.query<Skill, [number]>(`SELECT id, name, value FROM Skills WHERE id = ?`)
const insertQuery = database.query<Skill, [string, number]>(
  `INSERT INTO Skills (name, value) VALUES (?, ?) RETURNING id, name, value`,
)
const deleteQuery = database.query(`DELETE FROM Skills WHERE id = ?`)

export const SkillModel = {
  findAll: async (): Promise<Skill[]> => findAllQuery.all(),

  findById: async (id: number): Promise<Skill | null> => findByIdQuery.get(id) ?? null,

  create: async (input: Omit<Skill, 'id'>): Promise<Skill> => insertQuery.get(input.name, input.value)!,

  delete: async (id: number): Promise<boolean> => deleteQuery.run(id).changes > 0,
}
