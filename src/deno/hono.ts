import { Hono, RegExpRouter } from 'https://deno.land/x/hono@v3.2.5/mod.ts'
import { Jwt } from "https://deno.land/x/hono@v3.8.0-rc.2/utils/jwt/index.ts";
const { sign } = Jwt;

const app = new Hono({ router: new RegExpRouter() })

const secret = 'yourSecretKey'

  
app.get('/', (c) => c.text('Hi'))
    .get('/id/:id', (c) => c.text(c.req.param('id')))
    .get('/query', (c) => c.text(c.req.query('name') ?? 'notFound'))
    .get('/token/:token', async (c) => c.text(await sign({token: c.req.param('token')}, secret)))



Deno.serve(
	{
		port: 3000
	},
	app.fetch
)