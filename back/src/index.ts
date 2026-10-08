import { Hono } from 'hono'
import './database'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
