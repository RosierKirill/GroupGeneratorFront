import type { Context } from 'hono'
import { SkillModel } from '../models/skill.model'

export const getSkills = async (c: Context) => {
  const skills = await SkillModel.findAll()
  return c.json(skills, 200)
}
