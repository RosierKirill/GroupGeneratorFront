export interface Skill {
  id: number
  name: string
  value: number // 0 à 5
}

export interface User {
  id: number
  name: string
  group: number | null
  skills: Skill[]
}
