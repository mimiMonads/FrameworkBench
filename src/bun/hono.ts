import { Hono } from 'hono'
import { RegExpRouter } from 'hono/router/reg-exp-router'
import { sign } from 'hono/jwt'

const app = new Hono({ router: new RegExpRouter() })

const secret = 'yourSecretKey'

  
app.get('/', (c) => c.text('Hi'))
    .get('/id/:id', (c) => c.text(c.req.param('id')))
    .get('/query', (c) => c.text(c.req.query('name') ?? 'notFound'))
    .get('/token/:token', async (c) => c.text(await sign({token: c.req.param('token')}, secret)))

export default app