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
  name: string
  value: Skill['value']
}

export interface Group {
  id: number
  users: (User & { skills: UserSkill[] })[]
}

export interface CreateGroupsInput {
  nb_group: number
  nb_user?: number
}
