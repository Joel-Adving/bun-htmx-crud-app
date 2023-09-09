import Elysia, { Context, t } from 'elysia'
import { Static } from '@sinclair/typebox'
import { Todo, TodosStore } from '../store/todosStore'
import { fromBoolean, toBoolean } from '../utils/helpers'

export function todosRoutes(app: Elysia) {
  return app
    .decorate('todosStore', new TodosStore())
    .get('/todos', handleGetTodos)
    .get('/todos/:id', handleGetTodoById)
    .post('/todos', handleCreateTodo, todoValidationSchema)
    .put('/todos/:id', handleUpdateTodo, todoValidationSchema)
    .delete('/todos/:id', handleDeleteTodo)
}

async function handleGetTodoById({ todosStore, params }: Pick<TodoRequest, 'todosStore' | 'params'>) {
  const todo = await todosStore.get(parseInt(params.id))
  return todoTemplate(todo)
}

async function handleGetTodos({ todosStore }: Pick<TodoRequest, 'todosStore'>) {
  const todos = await todosStore.getAll()
  return todos.map((todo) => todoTemplate(todo)).join('')
}

async function handleCreateTodo({ todosStore, body }: Pick<TodoRequest, 'todosStore' | 'body'>) {
  const newtodo = await todosStore.create(body)
  return todoTemplate(newtodo)
}

async function handleUpdateTodo({ todosStore, params, body }: Pick<TodoRequest, 'todosStore' | 'params' | 'body'>) {
  const updatedtodo = await todosStore.update(+params.id, body)
  return todoTemplate(updatedtodo)
}

async function handleDeleteTodo({ todosStore, params }: Pick<TodoRequest, 'todosStore' | 'params'>) {
  await todosStore.delete(parseInt(params.id))
  return { success: true }
}

function todoTemplate(todo: Todo) {
  const completed = toBoolean(todo.completed)
  return `
      <div id="todo-${todo.id}" class="flex justify-between items-center border-b py-3">
        <div class="flex gap-3 items-center">
            ${completed ? '<div>✅</div>' : ''}
          <form 
            hx-put="/todos/${todo.id}"
            hx-swap="outerHTML"
            hx-trigger="click"
            hx-target="#todo-${todo.id}"
           >
            <input name="completed" type="number" value="${fromBoolean(!completed)}" hidden/>
            <input name="title" type="text" value="${todo.title}" hidden/>
            <button type="submit" class="${completed ? 'line-through' : ''} text-xl hover:cursor-pointer">
              ${todo.title}
            </button>
          </form>
        </div>
          <button 
            hx-delete="/todos/${todo.id}"
            hx-swap="delete"
            hx-target="#todo-${todo.id}"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded max-w-fit h-11">
              Delete
          </button>
      </div>
      `
}

const todoValidationSchema = {
  body: t.Object({
    title: t.Optional(t.String()),
    completed: t.Optional(t.String())
  })
}

export type TodoRequestBody = Static<typeof todoValidationSchema.body>

type TodoRequest = Context & {
  todosStore: TodosStore
  params: { id: string }
  body: TodoRequestBody
}
