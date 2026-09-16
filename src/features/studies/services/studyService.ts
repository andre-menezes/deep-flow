import { http } from '@/shared/http'
import type { CreateStudyInput, Study } from '../domain/study'

export const studyService = {
  list() {
    return http<{ items: Study[] }>('/studies')
  },
  create(body: CreateStudyInput) {
    return http<Study>('/studies', { method: 'POST', body })
  },
  getById(studyId: string) {
    return http<Study>(`/studies/${studyId}`)
  },
}
