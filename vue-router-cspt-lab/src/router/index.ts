import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Home / index
    { path: '/', component: () => import('../pages/IndexPage.vue') },
    // Static
    { path: '/about', component: () => import('../pages/AboutPage.vue') },
    // Dynamic segment
    { path: '/users/:userId', component: () => import('../pages/UserPage.vue') },
    // Optional segment
    { path: '/:lang?/categories', component: () => import('../pages/CategoriesPage.vue') },
    // Catch-all (returns array!)
    { path: '/files/:pathMatch(.*)*', component: () => import('../pages/FilesPage.vue') },
    // Nested dynamic
    { path: '/teams/:teamId/members/:memberId', component: () => import('../pages/MemberPage.vue') },
    // Multiple params
    { path: '/shop/:category/:productId', component: () => import('../pages/ProductPage.vue') },
    // Regex constrained
    { path: '/items/:itemId(\\d+)', component: () => import('../pages/ItemPage.vue') },
    // Repeatable param (one or more segments)
    { path: '/docs/:chapters+', component: () => import('../pages/DocsPage.vue') },
    // Layout with children
    {
      path: '/dashboard',
      component: () => import('../pages/DashboardLayout.vue'),
      children: [
        { path: '', component: () => import('../pages/DashboardIndex.vue') },
        { path: 'stats', component: () => import('../pages/DashboardStats.vue') },
        { path: 'settings', component: () => import('../pages/DashboardSettings.vue') },
      ]
    },
    // Encoding test routes
    { path: '/encoding-test/:testParam', component: () => import('../pages/EncodingTestPage.vue') },
    { path: '/encoding-catchall/:pathMatch(.*)*', component: () => import('../pages/EncodingCatchallPage.vue') },
  ]
})
export default router
