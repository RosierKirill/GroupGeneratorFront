import { database } from '../database'
import type { Skill } from '../entities'
import type { UserWithSkills } from '../types/user'

interface UserSkillRow {
  id: number
  name: string
  group: number | null
  skillId: number | null
  skillName: string | null
  skillValue: Skill['value'] | null
}

const findAllQuery = database.query<UserSkillRow, []>(`
  SELECT
    u.id,
    u.name,
    u."group" AS "group",
    s.id      AS skillId,
    s.name    AS skillName,
    s.value   AS skillValue
  FROM "User" u
  LEFT JOIN Userskills us ON us.userId = u.id
  LEFT JOIN Skills s      ON s.id = us.skillId
  ORDER BY u.id, s.id
`)

export const UserModel = {
  findAll: async (): Promise<UserWithSkills[]> => {
    const users = new Map<number, UserWithSkills>()

    for (const row of findAllQuery.all()) {
      let user = users.get(row.id)
      if (!user) {
        user = { id: row.id, name: row.name, group: row.group, skills: [] }
        users.set(row.id, user)
      }
      if (row.skillId !== null) {
        user.skills.push({ id: row.skillId, name: row.skillName!, value: row.skillValue! })
      }
    }

    return [...users.values()]
  },
}
