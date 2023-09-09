import Elysia from 'elysia'

export function miscRoutes(app: Elysia) {
  return app
    .get('/misc/hello', () => 'Hello World')
    .post('/misc/clicked', () => `<p class="text-4xl font-semibold">${Math.round(Math.random() * 100)}</p>`)
}
