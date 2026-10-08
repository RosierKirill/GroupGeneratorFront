import type { Skill, User } from '../entities'

export type UserWithSkills = User & { skills: Skill[] }

export interface UserInput {
  name: string
  skills: Omit<Skill, 'id'>[]
}
