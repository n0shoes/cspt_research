import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home / index — inline component in app.ts

  // Static route
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },

  // Dynamic segment — paramMap → HttpClient (template literal)
  {
    path: 'users/:userId',
    loadComponent: () =>
      import('./pages/user/user.component').then((m) => m.UserComponent),
  },

  // Multiple params — paramMap x2 → HttpClient (concatenation)
  {
    path: 'shop/:category/:productId',
    loadComponent: () =>
      import('./pages/product/product.component').then(
        (m) => m.ProductComponent
      ),
  },

  // Nested dynamic — paramMap x2 → HttpClient (template literal)
  {
    path: 'teams/:teamId/members/:memberId',
    loadComponent: () =>
      import('./pages/member/member.component').then(
        (m) => m.MemberComponent
      ),
  },

  // Layout route with nested children
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      // Index route — queryParamMap → router.navigate (open redirect)
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard-index/dashboard-index.component').then(
            (m) => m.DashboardIndexComponent
          ),
      },
      // Stats — queryParamMap → HttpClient → bypassSecurityTrustHtml → innerHTML (XSS)
      {
        path: 'stats',
        loadComponent: () =>
          import('./pages/dashboard-stats/dashboard-stats.component').then(
            (m) => m.DashboardStatsComponent
          ),
      },
      // Settings — queryParamMap → ApiService.get (wrapper sink)
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './pages/dashboard-settings/dashboard-settings.component'
          ).then((m) => m.DashboardSettingsComponent),
      },
    ],
  },

  // Encoding diagnostic
  {
    path: 'encoding-test/:testParam',
    loadComponent: () =>
      import('./pages/encoding-test/encoding-test.component').then(
        (m) => m.EncodingTestComponent
      ),
  },

  // Wildcard 404
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
