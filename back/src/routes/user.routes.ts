import { Hono } from 'hono'
import { getUsers } from '../controllers/user.controller'

const users = new Hono()

users.get('/', getUsers)

export default users
