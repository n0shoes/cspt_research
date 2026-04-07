import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div style="padding: 2rem; font-family: monospace">
      <h1 style="color: #f44">404 — Not Found</h1>
      <p style="color: #888">
        Angular wildcard route (<code>**</code>) caught this URL.
      </p>
      <p style="color: #888">
        Unlike React Router's <code>*</code> splat, Angular's <code>**</code>
        wildcard does NOT capture sub-paths as a parameter.
        The wildcard consumes all segments but stores no <code>posParams</code>.
      </p>
      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-top: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">CURRENT URL</div>
        <code style="color: #ccc">{{ currentUrl }}</code>
      </div>
      <p style="margin-top: 1rem"><a href="/">← Back to home</a></p>
    </div>
  `,
})
export class NotFoundComponent {
  currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
  }
}
