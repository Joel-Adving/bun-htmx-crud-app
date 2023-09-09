import Elysia from 'elysia'

export function viewRoutes(app: Elysia) {
  return app
    .get('/', () => Bun.file('./public/html/index.html'))
    .get('/boost', () => Bun.file('./public/html/boost.html'))
}
