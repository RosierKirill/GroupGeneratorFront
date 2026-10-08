import { database } from '../database'
import type { UserInput, UserWithSkills } from '../types/user'

interface UserSkillRow {
  id: number
  name: string
  group: number | null
  skillId: number | null
}

const findAllQuery = database.query<UserSkillRow, []>(`
  SELECT
    u.id,
    u.name,
    u."group"  AS "group",
    us.skillId AS skillId
  FROM "User" u
  LEFT JOIN Userskills us ON us.userId = u.id
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
const createTransaction = database.transaction((input: UserInput): UserWithSkills => {
  const { id } = insertUserQuery.get(input.name)!

  const skills = input.skills.map(({ skillId }) => {
    insertUserSkillQuery.run(id, skillId)
    return { userId: id, skillId }
  })

  return { id, name: input.name, group: null, skills }
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
        user.skills.push({ userId: row.id, skillId: row.skillId })
      }
    }

    return [...users.values()]
  },

  // Renvoie les ids qui n'existent pas dans la table Skills
  findMissingSkillIds: async (skillIds: number[]): Promise<number[]> =>
    skillIds.filter((skillId) => !findSkillQuery.get(skillId)),

  create: async (input: UserInput): Promise<UserWithSkills> => createTransaction(input),
}
