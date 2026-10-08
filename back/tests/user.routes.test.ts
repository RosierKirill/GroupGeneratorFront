import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { Hono } from 'hono'
import { UserModel } from '../src/models/user.model'
import type { UserWithSkills } from '../src/types/user'
import users from '../src/routes/user.routes'

const app = new Hono().route('/users', users)
let findAll: ReturnType<typeof spyOn<any, any>>

describe('GET /users', () => {
  beforeEach(() => {
    findAll = spyOn(UserModel as any, 'findAll')
  })

  afterEach(() => {
    findAll.mockRestore()
  })

  it('returns 200 with users and their skills', async () => {
    const data: UserWithSkills[] = [
      { id: 1, name: 'Alice', group: 1, skills: [{ id: 1, name: 'JS', value: 4 }] },
      { id: 2, name: 'Bob', group: null, skills: [] },
    ]
    findAll.mockResolvedValue(data)

    const res = await app.request('/users')

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('application/json')
    expect(await res.json()).toEqual(data)
    expect(findAll).toHaveBeenCalledTimes(1)
  })

  it('returns 200 with an empty array when there are no users', async () => {
    findAll.mockResolvedValue([])

    const res = await app.request('/users')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  it('returns 500 when the model throws', async () => {
    findAll.mockRejectedValue(new Error('db down'))

    const res = await app.request('/users')

    expect(res.status).toBe(500)
  })
})
