import Database from 'bun:sqlite'
import { TodoRequestBody } from '../routes/todos'

export type Todo = {
  id: number
  title: string
  completed: 0 | 1 // sqlite only suppoert boolean as 0 or 1
}

export class TodosStore {
  private db: Database

  constructor() {
    this.db = new Database('todos.db')
    try {
      this.init()
    } catch (e) {
      console.log(`Error initializing database: ${e}`)
    }
  }

  async get(id: number) {
    return this.db.query(`SELECT * FROM todos WHERE id = ${id}`).get() as Todo
  }

  async getAll() {
    return this.db.query('SELECT * FROM todos ORDER BY id DESC').all() as Todo[]
  }

  async create(todo: TodoRequestBody) {
    if (!todo.title) {
      throw new Error('Title is required')
    }
    return (await this.db.query(`INSERT INTO todos (title) VALUES (?) RETURNING *`).get(todo.title)) as Todo
  }

  async update(id: number, todo: TodoRequestBody) {
    if (!todo.title || !todo.completed || !id) {
      throw new Error('Title, completed and id are required')
    }
    return (await this.db
      .query(`UPDATE todos SET title = ?, completed = ? WHERE id = ? RETURNING *`)
      .get(todo.title, todo.completed, id)) as Todo
  }

  async delete(id: number) {
    return this.db.run(`DELETE FROM todos WHERE id = ${id}`)
  }

  async init() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, 
            completed BOOLEAN DEFAULT FALSE
        )`
    )
  }
}
