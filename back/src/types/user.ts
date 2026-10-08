import type { Skill, User } from '../entities'

export type UserWithSkills = User & { skills: Skill[] }
