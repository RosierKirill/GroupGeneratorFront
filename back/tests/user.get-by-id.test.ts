import { Hono } from 'hono'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { UserModel } from '../src/models/user.model'
import users from '../src/routes/user.routes'

const app = new Hono().route('/users', users)
let findById: ReturnType<typeof spyOn<any, any>>

describe('GET /users/:id', () => {
  beforeEach(() => {
    findById = spyOn(UserModel as any, 'findById')
  })

  afterEach(() => {
    findById.mockRestore()
  })

  it('returns 200 with the user and their skills', async () => {
    const user = {
      id: 1,
      name: 'Alice',
      group: 2,
      skills: [{ id: 1, name: 'JS', value: 4 as const }],
    }
    findById.mockResolvedValue(user)

    const res = await app.request('/users/1')

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('application/json')
    expect(await res.json()).toEqual(user)
    expect(findById).toHaveBeenCalledWith(1)
  })

  it('returns a user without group and without skills', async () => {
    const user = { id: 2, name: 'Bob', group: null, skills: [] }
    findById.mockResolvedValue(user)

    const res = await app.request('/users/2')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(user)
  })

  it('returns 404 when the user does not exist', async () => {
    findById.mockResolvedValue(null)

    const res = await app.request('/users/999')

    expect(res.status).toBe(404)
    expect(findById).toHaveBeenCalledWith(999)
  })

  it.each(['abc', '1.5', '-1'])('returns 404 without querying the model for id "%s"', async (id) => {
    const res = await app.request(`/users/${id}`)

    expect(res.status).toBe(404)
    expect(findById).not.toHaveBeenCalled()
  })

  it('returns 500 when the model throws', async () => {
    findById.mockRejectedValue(new Error('db down'))

    const res = await app.request('/users/1')

    expect(res.status).toBe(500)
  })
})
