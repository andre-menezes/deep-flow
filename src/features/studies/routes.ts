import type { RouteRecordRaw } from 'vue-router'

export const studiesRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'studies-home',
    component: () => import('./views/StudiesHomeView.vue'),
  },
  {
    path: '/studies/new',
    name: 'studies-create',
    component: () => import('./views/StudyCreateWizardView.vue'),
  },
]
