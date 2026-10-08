import { Hono } from 'hono'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { GroupModel } from '../src/models/group.model'
import groups from '../src/routes/group.routes'

const app = new Hono().route('/groups', groups)
let findAll: ReturnType<typeof spyOn<any, any>>

describe('GET /groups', () => {
  beforeEach(() => {
    findAll = spyOn(GroupModel as any, 'findAll')
  })

  afterEach(() => {
    findAll.mockRestore()
  })

  it('returns 200 with groups and their users', async () => {
    const data = [
      {
        id: 1,
        users: [
          { id: 1, name: 'Alice', group: 1, skills: [{ id: 1, name: 'JS', value: 4 as const }] },
          { id: 2, name: 'Bob', group: 1, skills: [] },
        ],
      },
      { id: 2, users: [{ id: 3, name: 'Carl', group: 2, skills: [] }] },
    ]
    findAll.mockResolvedValue(data)

    const res = await app.request('/groups')

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('application/json')
    expect(await res.json()).toEqual(data)
    expect(findAll).toHaveBeenCalledTimes(1)
  })

  it('returns 200 with an empty array when no groups exist', async () => {
    findAll.mockResolvedValue([])

    const res = await app.request('/groups')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  it('returns 500 when the model throws', async () => {
    findAll.mockRejectedValue(new Error('db down'))

    const res = await app.request('/groups')

    expect(res.status).toBe(500)
  })
})
