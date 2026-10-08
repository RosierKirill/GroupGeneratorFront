export interface User {
  id: number
  name: string
  group: number
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
