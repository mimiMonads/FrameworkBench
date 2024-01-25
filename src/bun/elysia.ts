import { Elysia  } from "elysia"
import { jwt } from '@elysiajs/jwt'

new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'yourSecretKey'
        })
    )
	.get("/", () => "Hi")
	.get("/id/:id", (c) => c.params.id)
    .get("/query", (c) => c.query?.hello ?? 'notFound')
    .get('/token/:token', async c => c.jwt.sign(c.params))
	.listen(3000)