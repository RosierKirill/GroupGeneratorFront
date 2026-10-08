import type { Context } from 'hono'
import type { Skill } from '../entities'
import { UserModel } from '../models/user.model'
import type { UserInput } from '../types/user'

export const getUsers = async (c: Context) => {
  const users = await UserModel.findAll()
  return c.json(users, 200)
}

// Renvoie un message d'erreur si le body est invalide, sinon null
const validateUserInput = (body: any): string | null => {
  if (typeof body !== 'object' || body === null) return 'Le body doit être un objet JSON.'
  if (typeof body.name !== 'string' || body.name.trim() === '') return "Le champ 'name' est requis."
  if (!Array.isArray(body.skills)) return "Le champ 'skills' doit être un tableau."

  const names = new Set<string>()
  for (const skill of body.skills) {
    if (typeof skill?.name !== 'string' || skill.name.trim() === '') {
      return "Chaque skill doit avoir un 'name'."
    }
    if (!Number.isInteger(skill.value) || skill.value < 1 || skill.value > 5) {
      return `La valeur du skill '${skill.name}' doit être un entier entre 1 et 5.`
    }
    if (names.has(skill.name)) return `Le skill '${skill.name}' est en double.`
    names.add(skill.name)
  }

  return null
}

export const createUser = async (c: Context) => {
  const body = await c.req.json().catch(() => null)

  const error = validateUserInput(body)
  if (error) return c.json({ message: error }, 400)

  const input: UserInput = {
    name: body.name.trim(),
    skills: body.skills.map((skill: Omit<Skill, 'id'>) => ({
      name: skill.name.trim(),
      value: skill.value,
    })),
  }

  const user = await UserModel.create(input)
  return c.json(user, 201)
}
