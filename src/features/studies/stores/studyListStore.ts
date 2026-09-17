import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CreateStudyInput, Study } from '../domain/study'
import { studyService } from '../services/studyService'

export const useStudyListStore = defineStore('study-list', () => {
  const data = ref<Study[]>([])
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const error = ref<string | null>(null)

  async function fetchStudies() {
    status.value = 'loading'
    error.value = null
    try {
      const res = await studyService.list()
      data.value = res.items
      status.value = 'success'
    } catch (err) {
      status.value = 'error'
      error.value = err instanceof Error ? err.message : 'INTERNAL_ERROR'
      throw err
    }
  }

  async function createStudy(input: CreateStudyInput) {
    const created = await studyService.create(input)
    data.value = [created, ...data.value]
    return created
  }

  return { data, status, error, fetchStudies, createStudy }
})
