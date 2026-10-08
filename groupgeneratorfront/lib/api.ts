import type { CreateGroupsInput, CreateUserInput, Group, Skill, User } from "./types"

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) throw new Error(`Erreur ${response.status}`)
  return response.json()
}

const post = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
})

export const getUsers = () => request<User[]>("/api/users")
export const getSkills = () => request<Skill[]>("/api/skills")
export const getGroups = () => request<Group[]>("/api/groups")
export const createUser = (input: CreateUserInput) => request<User>("/api/users", post(input))
export const createGroups = (input: CreateGroupsInput) => request<Group[]>("/api/groups", post(input))
