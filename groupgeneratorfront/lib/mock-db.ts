import type { CreateGroupsInput, CreateUserInput, Group, User, UserSkillInput } from "./types"

interface StoredUser extends User {
  skills: UserSkillInput[]
}

export const SKILLS = [
  { id: 1, name: "Frontend" },
  { id: 2, name: "Backend" },
  { id: 3, name: "Design" },
  { id: 4, name: "Gestion de projet" },
  { id: 5, name: "Tests" },
]

const seed: [string, number[]][] = [
  ["Alice", [5, 2, 3, 1, 2]],
  ["Bastien", [2, 5, 1, 3, 4]],
  ["Camille", [3, 1, 5, 4, 2]],
  ["Dylan", [4, 3, 2, 2, 5]],
  ["Emma", [1, 4, 4, 5, 3]],
  ["Farid", [5, 5, 1, 2, 3]],
]

const users: StoredUser[] = seed.map(([name, values], index) => ({
  id: index + 1,
  name,
  group: 0,
  skills: values.map((value, i) => ({ skillId: SKILLS[i].id, value })),
}))

let groups: Group[] = []

const toUser = ({ id, name, group }: StoredUser): User => ({ id, name, group })

export const listUsers = (): User[] => users.map(toUser)

export const listGroups = (): Group[] => groups

export function createUsers(inputs: CreateUserInput[]): User[] {
  const created = inputs.map((input) => {
    const user: StoredUser = {
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      name: input.name.trim(),
      group: 0,
      skills: input.skills,
    }
    users.push(user)
    return toUser(user)
  })
  return created
}

export function generateGroups({ nb_group, nb_user }: CreateGroupsInput): Group[] {
  const total = (user: StoredUser) => user.skills.reduce((sum, s) => sum + s.value, 0)
  const ranked = [...users].sort((a, b) => total(b) - total(a))
  const buckets: StoredUser[][] = Array.from({ length: nb_group }, () => [])
  const sizes = buckets.map(() => 0)

  for (const user of ranked) {
    const candidates = buckets
      .map((_, i) => i)
      .filter((i) => nb_user === undefined || sizes[i] < nb_user)
    if (candidates.length === 0) break
    const target = candidates.reduce((best, i) => (sizes[i] < sizes[best] ? i : best))
    buckets[target].push(user)
    sizes[target]++
  }

  users.forEach((u) => (u.group = 0))
  groups = buckets.map((members, i) => {
    members.forEach((m) => (m.group = i + 1))
    return { id: i + 1, members: members.map(toUser) }
  })
  return groups
}
