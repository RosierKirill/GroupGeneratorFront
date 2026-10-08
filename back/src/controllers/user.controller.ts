import type { Context } from 'hono'
import { UserModel } from '../models/user.model'

export const getUsers = async (c: Context) => {
  const users = await UserModel.findAll()
  return c.json(users, 200)
}
