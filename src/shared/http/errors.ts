export type ApiProblem = {
  type?: string
  title?: string
  status: number
  detail?: string
  code: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly problem?: ApiProblem

  constructor(problem: ApiProblem) {
    super(problem.code)
    this.name = 'ApiError'
    this.status = problem.status
    this.code = problem.code
    this.problem = problem
  }
}
