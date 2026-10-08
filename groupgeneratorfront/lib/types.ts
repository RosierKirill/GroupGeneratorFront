export interface User {
  id: number
  name: string
  group: number
}

export interface Group {
  id: number
  members: User[]
}

export interface Skill {
  id: number
  name: string
  value: 1 | 2 | 3 | 4 | 5
}

export interface UserSkillInput {
  skillId: number
  value: number
}

export interface CreateUserInput {
  name: string
  skills: UserSkillInput[]
}

export interface CreateGroupsInput {
  nb_group: number
  nb_user?: number
}
