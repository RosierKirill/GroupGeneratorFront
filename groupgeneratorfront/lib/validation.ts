import type { CreateGroupsInput, CreateUserInput } from "./types"

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const isPositiveInt = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0

const toArray = (body: unknown): unknown[] => (Array.isArray(body) ? body : [body])

export function parseUsers(body: unknown): CreateUserInput[] | null {
  const items = toArray(body)
  if (items.length === 0) return null
  const parsed: CreateUserInput[] = []
  for (const item of items) {
    if (!isRecord(item) || typeof item.name !== "string" || item.name.trim() === "") return null
    if (!Array.isArray(item.skills)) return null
    for (const skill of item.skills) {
      if (!isRecord(skill) || !Number.isInteger(skill.skillId)) return null
      if (!Number.isInteger(skill.value) || (skill.value as number) < 0 || (skill.value as number) > 5) return null
    }
    parsed.push({ name: item.name, skills: item.skills as CreateUserInput["skills"] })
  }
  return parsed
}

export function parseGroups(body: unknown): CreateGroupsInput | null {
  const [item] = toArray(body)
  if (!isRecord(item) || !isPositiveInt(item.nb_group)) return null
  if (item.nb_user !== undefined && !isPositiveInt(item.nb_user)) return null
  return { nb_group: item.nb_group, nb_user: item.nb_user as number | undefined }
}
