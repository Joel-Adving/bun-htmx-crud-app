import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { routes } from './routes'

const app = new Elysia()

app.use(html)
app.use(staticPlugin())
app.use(routes)

app.listen(3000)
