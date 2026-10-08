import { Hono } from 'hono'
import './database'
import groups from './routes/group.routes'
import users from './routes/user.routes'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/users', users)
app.route('/groups', groups)

export default app
