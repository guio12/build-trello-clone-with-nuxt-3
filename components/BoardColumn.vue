<script setup lang="ts">
import { useBoardStore } from '../stores/boardStore'

const props = defineProps<{
  column: object
  columnIndex: number
}>()

const boardStore = useBoardStore()
const router = useRouter()

const editNameState = ref(false)
const newTaskName = ref('')

const addTask = () => {
  boardStore.addTask({
    taskName: newTaskName.value,
    columnIndex: props.columnIndex,
  })
  newTaskName.value = ''
}

const deleteColumn = (columnIndex: number) =>
  boardStore.deleteColumn(columnIndex)

const goToTask = (taskId: number) => {
  router.push(`/tasks/${taskId}`)
}
</script>

<template>
  <UContainer class="column">
    <div class="column-header mb-4">
      <div>
        <UInput
          v-if="editNameState"
          type="text"
          v-model="column.name"
          @keyup.enter="editNameState = !editNameState"
        />
        <h2 v-else>{{ column.name }}</h2>
      </div>

      <div>
        <UButton
          icon="i-heroicons-pencil-square"
          class="mr-2"
          @click="editNameState = !editNameState"
        />
        <UButton
          icon="i-heroicons-trash"
          color="red"
          @click="deleteColumn(columnIndex)"
        />
      </div>
    </div>
    <ul>
      <li v-for="task in column.tasks" :key="task.id">
        <UCard class="mb-4" @click="goToTask(task.id)">
          <strong>{{ task.name }}</strong>
          <p>{{ task.description }}</p>
        </UCard>
      </li>
    </ul>
    <UInput
      v-model="newTaskName"
      type="text"
      placeholder="Create new column"
      icon="i-heroicons-plus-circle-solid"
      @keyup.enter="addTask"
    />
  </UContainer>
</template>
