import { Hono } from 'hono'
import { createGroups, getGroups } from '../controllers/group.controller'

const groups = new Hono()

groups.get('/', getGroups)
groups.post('/', createGroups)

export default groups
