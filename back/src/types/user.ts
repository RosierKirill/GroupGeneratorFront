import type { User, UserSkill } from '../entities'

export type UserWithSkills = User & { skills: UserSkill[] }

export interface UserInput {
  name: string
  skills: { skillId: number; value: number }[]
}
