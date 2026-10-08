import type { User } from '../types/user'

// Données mockées en attendant la création des tables
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Alice',
    group: null,
    skills: [
      { id: 1, name: 'JavaScript', value: 4 },
      { id: 2, name: 'Design', value: 2 },
    ],
  },
  {
    id: 2,
    name: 'Bob',
    group: null,
    skills: [
      { id: 1, name: 'JavaScript', value: 3 },
      { id: 3, name: 'Gestion de projet', value: 5 },
    ],
  },
]

export const UserModel = {
  findAll: async (): Promise<User[]> => mockUsers,
}
