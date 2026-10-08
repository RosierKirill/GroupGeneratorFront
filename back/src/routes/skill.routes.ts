import { Hono } from 'hono'
import { getSkills } from '../controllers/skill.controller'

const skills = new Hono()

skills.get('/', getSkills)

export default skills
