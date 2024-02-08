<script setup lang="ts">
import { useBoardStore } from '../stores/boardStore'

const boardStore = useBoardStore()
const route = useRoute()
const router = useRouter()

const isModalOpen = computed(() => {
  return route.name === 'index-tasks-id'
})
const newColumnName = ref('')

const addColumn = () => {
  boardStore.addColumn(newColumnName.value)
  newColumnName.value = ''
}

const closeModal = () => {
  router.push('/')
}
</script>

<template>
  <div class="board-wrapper">
    <main class="board">
      <BoardColumn
        v-for="(column, columnIndex) in boardStore.board.columns"
        :key="column.id"
        :column="column"
        :column-index="columnIndex"
      />
      <UContainer class="column">
        <UInput
          v-model="newColumnName"
          type="text"
          placeholder="Create new column"
          icon="i-heroicons-plus-circle-solid"
          @keyup.enter="addColumn"
        />
      </UContainer>
    </main>
    <div v-show="isModalOpen" class="task-bg" @click.self="closeModal">
      <NuxtPage :key="route.fullPath" />
    </div>
  </div>
</template>
