import { Hono } from 'hono'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { GroupModel } from '../src/models/group.model'
import groups from '../src/routes/group.routes'

const app = new Hono().route('/groups', groups)
let create: ReturnType<typeof spyOn<any, any>>

const post = (body: unknown) =>
  app.request('/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

const generated = [
  { id: 1, users: [{ id: 1, name: 'Alice', group: 1, skills: [] }] },
  { id: 2, users: [{ id: 2, name: 'Bob', group: 2, skills: [] }] },
]

describe('POST /groups', () => {
  beforeEach(() => {
    create = spyOn(GroupModel as any, 'create')
  })

  afterEach(() => {
    create.mockRestore()
  })

  it('returns 201 with the generated groups', async () => {
    create.mockResolvedValue(generated)

    const res = await post({ nb_group: 2 })

    expect(res.status).toBe(201)
    expect(await res.json()).toEqual(generated)
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ nb_group: 2 }))
  })

  it('passes nb_user to the model when provided', async () => {
    create.mockResolvedValue(generated)

    const res = await post({ nb_group: 2, nb_user: 3 })

    expect(res.status).toBe(201)
    expect(create).toHaveBeenCalledWith({ nb_group: 2, nb_user: 3 })
  })

  describe.each([
    ['invalid JSON', '{not json'],
    ['body is not an object', 'null'],
    ['nb_group missing', {}],
    ['nb_group missing but nb_user given', { nb_user: 3 }],
    ['nb_group is 0', { nb_group: 0 }],
    ['nb_group is negative', { nb_group: -1 }],
    ['nb_group is not an integer', { nb_group: 1.5 }],
    ['nb_group is a string', { nb_group: '2' }],
    ['nb_user is 0', { nb_group: 2, nb_user: 0 }],
    ['nb_user is negative', { nb_group: 2, nb_user: -1 }],
    ['nb_user is not an integer', { nb_group: 2, nb_user: 2.5 }],
    ['nb_user is a string', { nb_group: 2, nb_user: '3' }],
  ])('returns 400 when %s', (_label, body) => {
    it('rejects the request without calling the model', async () => {
      const res = await post(body)

      expect(res.status).toBe(400)
      expect(await res.json()).toEqual({ message: expect.any(String) })
      expect(create).not.toHaveBeenCalled()
    })
  })

  it('returns 500 when the model throws', async () => {
    create.mockRejectedValue(new Error('db down'))

    const res = await post({ nb_group: 2 })

    expect(res.status).toBe(500)
  })
})
