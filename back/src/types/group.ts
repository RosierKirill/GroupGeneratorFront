import type { UserWithSkills } from './user'

export interface Group {
  id: number
  users: UserWithSkills[]
}

export interface CreateGroupsInput {
  nb_group: number
  nb_user?: number
}
