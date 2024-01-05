// Composables
import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect:'/square',
    //component: () => import('@/layouts/square/SquareLayout.vue'),
    children: [
      {
        path: '/square',
        name: '',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: '/square/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: '/square/home',
        name: 'Square',
        component: () => import('@/views/Square.vue'),
        children: [
        {
          path: '/square/coming-soon',
          name: 'Coming Soon',
          component: () => import('@/views/coming-soon.vue'),
        },
        {
          path: '/square/qa-tools/deployment-check/test',
          name: 'Test',
          component: () => import('@/views/qa-tools/deployment-check/test.vue'),
        },
        {
          path: '/square/qa-tools/deployment-check/qa-service-check',
          name: 'QA Service Check',
          component: () => import('@/views/qa-tools/deployment-check/qa-service-check.vue'),
        },
        {
          path: '/square/qa-tools/deployment-check/uat-service-check',
          name: 'UAT Service Check',
          component: () => import('@/views/qa-tools/deployment-check/uat-service-check.vue'),
        },
        {
          path: '/square/qa-tools/deployment-check/environment-compare',
          name: 'Environment Compare',
          component: () => import('@/views/qa-tools/deployment-check/environment-compare.vue'),
        },
        {
          path: '/square/qa-tools/jira-tools/query-issue',
          name: 'Query Issue',
          component: () => import('@/views/qa-tools/jira-tools/query-issue.vue'),
        },
        {
          path: '/square/qa-tools/qa-reports/automation-report',
          name: 'QA Reports',
          component: () => import('@/views/qa-tools/qa-reports/automation-report.vue'),
        },
        {
          path: '/square/qa-tools/qa-reports/automation-report-new',
          name: 'QA Reports New',
          component: () => import('@/views/qa-tools/qa-reports/automation-report-new.vue'),
        },
        {
          path: '/square/qa-tools/qa-reports/jenkins-report-ui',
          name: 'Jenkins Report UI',
          component: () => import('@/views/qa-tools/qa-reports/jenkins-report-ui.vue'),
        },
        {
          path: '/square/qa-tools/qa-reports/jenkins-report-api',
          name: 'Jenkins Report API',
          component: () => import('@/views/qa-tools/qa-reports/jenkins-report-api.vue'),
        },
        {
          path: '/square/ai-tools/wenxin/llama213b',
          name: '文心一言Llama213B',
          component: () => import('@/views/ai-tools/wenxin/wenxin-chat.vue'),
        }
        ]
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
