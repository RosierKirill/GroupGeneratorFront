import { Hono } from 'hono'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import users from '../src/routes/user.routes'
import { UserModel } from '../src/models/user.model'

const app = new Hono().route('/users', users)
let create: ReturnType<typeof spyOn<any, any>>

const post = (body: unknown) =>
  app.request('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

describe('POST /users', () => {
  beforeEach(() => {
    create = spyOn(UserModel as any, 'create')
  })

  afterEach(() => {
    create.mockRestore()
  })

  it('returns 201 with the created user', async () => {
    const created = {
      id: 1,
      name: 'Alice',
      group: null,
      skills: [{ id: 1, name: 'JS', value: 4 as const }],
    }
    create.mockResolvedValue(created)

    const res = await post({ name: 'Alice', skills: [{ name: 'JS', value: 4 }] })

    expect(res.status).toBe(201)
    expect(await res.json()).toEqual(created)
    expect(create).toHaveBeenCalledWith({ name: 'Alice', skills: [{ name: 'JS', value: 4 }] })
  })

  it('accepts an empty skills array', async () => {
    create.mockResolvedValue({ id: 2, name: 'Bob', group: null, skills: [] })

    const res = await post({ name: 'Bob', skills: [] })

    expect(res.status).toBe(201)
  })

  it('trims name and skill names before creating', async () => {
    create.mockResolvedValue({ id: 3, name: 'Carl', group: null, skills: [] })

    await post({ name: '  Carl  ', skills: [{ name: ' JS ', value: 3 }] })

    expect(create).toHaveBeenCalledWith({ name: 'Carl', skills: [{ name: 'JS', value: 3 }] })
  })

  describe.each([
    ['invalid JSON', '{not json'],
    ['body is not an object', 'null'],
    ['name missing', { skills: [] }],
    ['name empty', { name: '   ', skills: [] }],
    ['name not a string', { name: 42, skills: [] }],
    ['skills missing', { name: 'Alice' }],
    ['skills not an array', { name: 'Alice', skills: 'JS' }],
    ['skill without name', { name: 'Alice', skills: [{ value: 3 }] }],
    ['skill value below 1', { name: 'Alice', skills: [{ name: 'JS', value: 0 }] }],
    ['skill value above 5', { name: 'Alice', skills: [{ name: 'JS', value: 6 }] }],
    ['skill value not an integer', { name: 'Alice', skills: [{ name: 'JS', value: 2.5 }] }],
    [
      'duplicate skill',
      {
        name: 'Alice',
        skills: [
          { name: 'JS', value: 3 },
          { name: 'JS', value: 4 },
        ],
      },
    ],
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

    const res = await post({ name: 'Alice', skills: [] })

    expect(res.status).toBe(500)
  })
})
