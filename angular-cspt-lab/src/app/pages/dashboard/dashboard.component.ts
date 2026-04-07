import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div>
      <h2>Dashboard</h2>
      <router-outlet />
    </div>
  `,
})
export class DashboardComponent {}
