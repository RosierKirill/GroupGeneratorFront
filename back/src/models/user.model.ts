import { database } from '../database'
import type { Skill } from '../entities'
import type { UserInput, UserWithSkills } from '../types/user'

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
    u."group"  AS "group",
    us.skillId AS skillId,
    s.name     AS skillName,
    s.value    AS skillValue
  FROM "User" u
  LEFT JOIN Userskills us ON us.userId = u.id
  LEFT JOIN Skills s      ON s.id = us.skillId
  ORDER BY u.id, us.skillId
`)

const insertUserQuery = database.query<{ id: number }, [string]>(
  'INSERT INTO "User" (name) VALUES (?) RETURNING id',
)

const findSkillQuery = database.query<{ id: number }, [number]>(
  'SELECT id FROM Skills WHERE id = ?',
)

const insertUserSkillQuery = database.query<null, [number, number]>(
  'INSERT INTO Userskills (userId, skillId) VALUES (?, ?)',
)

// Crée l'utilisateur et ses liens vers des skills existants
const createTransaction = database.transaction((input: UserInput): number => {
  const { id } = insertUserQuery.get(input.name)!
  for (const { skillId } of input.skills) insertUserSkillQuery.run(id, skillId)
  return id
})

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
        user.skills.push({
          userId: row.id,
          skillId: row.skillId,
          name: row.skillName!,
          value: row.skillValue!,
        })
      }
    }

    return [...users.values()]
  },

  // Renvoie les ids qui n'existent pas dans la table Skills
  findMissingSkillIds: async (skillIds: number[]): Promise<number[]> =>
    skillIds.filter((skillId) => !findSkillQuery.get(skillId)),

  create: async (input: UserInput): Promise<UserWithSkills> => {
    const id = createTransaction(input)
    const users = await UserModel.findAll()
    return users.find((user) => user.id === id)!
  },
}
