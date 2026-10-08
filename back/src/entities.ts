export interface User {
  id: number
  name: string
  group: number | null
}

export interface Skill {
  id: number
  name: string
  value: 1 | 2 | 3 | 4 | 5
}

export interface UserSkill {
  userId: number
  skillId: number
}

export interface Group {
  id: number
  users: (User & { skills: Skill[] })[]
}

export interface CreateGroupsInput {
  nb_group: number
  nb_user?: number
}
