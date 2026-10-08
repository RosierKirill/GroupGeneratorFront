import { Hono } from 'hono'
import { createUser, getUsers } from '../controllers/user.controller'

const users = new Hono()

users.get('/', getUsers)
users.post('/', createUser)

export default users
