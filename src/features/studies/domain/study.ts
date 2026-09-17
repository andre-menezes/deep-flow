export type StudyStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'

export type StudyRoutine = {
  frequency: string
  notes?: string
}

export type Study = {
  id: string
  title: string
  objective: string
  routine: StudyRoutine
  status: StudyStatus
  createdAt: string
}

export type CreateStudyInput = {
  title: string
  objective: string
  routine: StudyRoutine
  status?: StudyStatus
}
