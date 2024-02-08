import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import boardData from '~/data/board.json'

export const useBoardStore = defineStore('boardStore', () => {
  const board = useStorage('board', boardData)

  const addColumn = (columnName: string) => {
    board.value.columns.push({
      id: self.crypto.randomUUID(),
      name: columnName,
      tasks: [],
    })
  }

  const deleteColumn = (columnIndex: number) => {
    board.value.columns.splice(columnIndex, 1)
  }

  return {
    board,
    addColumn,
    deleteColumn,
  }
})
