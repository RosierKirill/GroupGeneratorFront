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
    u."group" AS "group",
    s.id      AS skillId,
    s.name    AS skillName,
    s.value   AS skillValue
  FROM "User" u
  LEFT JOIN Userskills us ON us.userId = u.id
  LEFT JOIN Skills s      ON s.id = us.skillId
  ORDER BY u.id, s.id
`)

const insertUserQuery = database.query<{ id: number }, [string]>(
  'INSERT INTO "User" (name) VALUES (?) RETURNING id',
)

const findSkillQuery = database.query<{ id: number }, [string, number]>(
  'SELECT id FROM Skills WHERE name = ? AND value = ?',
)

const insertSkillQuery = database.query<{ id: number }, [string, number]>(
  'INSERT INTO Skills (name, value) VALUES (?, ?) RETURNING id',
)

const insertUserSkillQuery = database.query<null, [number, number]>(
  'INSERT INTO Userskills (userId, skillId) VALUES (?, ?)',
)

// Crée l'utilisateur et ses compétences ; une compétence (name, value) déjà existante est réutilisée
const createTransaction = database.transaction((input: UserInput): UserWithSkills => {
  const { id } = insertUserQuery.get(input.name)!

  const skills = input.skills.map((skill) => {
    const existing = findSkillQuery.get(skill.name, skill.value)
    const skillId = existing?.id ?? insertSkillQuery.get(skill.name, skill.value)!.id
    insertUserSkillQuery.run(id, skillId)
    return { id: skillId, ...skill }
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
        user.skills.push({ id: row.skillId, name: row.skillName!, value: row.skillValue! })
      }
    }

    return [...users.values()]
  },

  create: async (input: UserInput): Promise<UserWithSkills> => createTransaction(input),
}
