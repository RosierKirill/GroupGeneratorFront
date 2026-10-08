import type { Context } from 'hono'
import type { CreateGroupsInput } from '../entities'
import { GroupModel } from '../models/group.model'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0

export const getGroups = async (c: Context) => {
  const groups = await GroupModel.findAll()
  return c.json(groups, 200)
}

export const createGroups = async (c: Context) => {
  const body: unknown = await c.req.json().catch(() => undefined)

  if (
    !isRecord(body) ||
    !isPositiveInteger(body.nb_group) ||
    (body.nb_user !== undefined && !isPositiveInteger(body.nb_user))
  ) {
    return c.json({ error: 'Body incomplet ou incorrect' }, 400)
  }

  const input: CreateGroupsInput = {
    nb_group: body.nb_group,
    ...(body.nb_user === undefined ? {} : { nb_user: body.nb_user }),
  }
  const groups = await GroupModel.generate(input.nb_group, input.nb_user)
  return c.json(groups, 201)
}
