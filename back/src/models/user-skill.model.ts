import { database } from '../database'
import type { Skill, UserSkill } from '../entities'

const findSkillsByUserQuery = database.query<Skill, [number]>(`
  SELECT s.id, s.name, s.value
  FROM Userskills us
  JOIN Skills s ON s.id = us.skillId
  WHERE us.userId = ?
  ORDER BY s.id
`)
const findUserIdsBySkillQuery = database.query<{ userId: number }, [number]>(
  `SELECT userId FROM Userskills WHERE skillId = ? ORDER BY userId`,
)
const insertQuery = database.query(`INSERT OR IGNORE INTO Userskills (userId, skillId) VALUES (?, ?)`)
const deleteQuery = database.query(`DELETE FROM Userskills WHERE userId = ? AND skillId = ?`)
const deleteAllForUserQuery = database.query(`DELETE FROM Userskills WHERE userId = ?`)

export const UserSkillModel = {
  findSkillsByUser: async (userId: number): Promise<Skill[]> => findSkillsByUserQuery.all(userId),

  findUserIdsBySkill: async (skillId: number): Promise<number[]> =>
    findUserIdsBySkillQuery.all(skillId).map((row) => row.userId),

  /** Retourne false si le lien existait déjà. */
  add: async ({ userId, skillId }: UserSkill): Promise<boolean> => insertQuery.run(userId, skillId).changes > 0,

  remove: async ({ userId, skillId }: UserSkill): Promise<boolean> =>
    deleteQuery.run(userId, skillId).changes > 0,

  removeAllForUser: async (userId: number): Promise<number> => deleteAllForUserQuery.run(userId).changes,
}
