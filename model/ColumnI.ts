import type { TaskI } from '~/model/TaskI'

export interface ColumnI {
  id: string
  name: string
  tasks: TaskI[]
}
