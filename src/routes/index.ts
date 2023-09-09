import Elysia from 'elysia'
import { viewRoutes } from './views'
import { miscRoutes } from './misc'
import { todosRoutes } from './todos'

export function routes(app: Elysia) {
  return app.use(viewRoutes).use(miscRoutes).use(todosRoutes)
}
