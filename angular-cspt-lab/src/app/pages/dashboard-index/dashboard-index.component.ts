import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

// Open Redirect Demo: queryParamMap → router.navigate()
// Risk: HIGH — query params are decoded, redirect accepts any path
// URL: /dashboard?redirect=//evil.com or /dashboard?redirect=..%2F..%2Fphishing
// NOTE: router.navigate() double-encodes % characters — see encoding behavior doc
@Component({
  selector: 'app-dashboard-index',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div style="padding: 2rem; font-family: monospace; max-width: 700px">
      <h1>queryParamMap — Open Redirect</h1>
      <p style="color: #888">
        Source: <code>queryParamMap.get('redirect')</code> flows into
        <code>router.navigate()</code>. The decoded value enables open redirect or
        path traversal navigation. Note: Angular's <code>router.navigate()</code>
        double-encodes % characters, so <code>navigateByUrl()</code> is the more
        dangerous sink for direct string injection.
      </p>

      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">SOURCE</div>
        <code style="color: #f90">queryParamMap.get('redirect')</code><br>
        <code style="color: #f90; font-size: 0.85rem">router.navigateByUrl(redirect) // open redirect sink</code>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (isDangerous ? '#f44' : (redirect ? '#555' : '#333'))"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RAW VALUE from queryParamMap</div>
        <code [style.color]="isDangerous ? '#f44' : '#ccc'" style="font-size: 1.1rem">
          redirect = {{ redirect | json }}
        </code>
        <div [style.color]="isDangerous ? '#f44' : '#888'" style="font-size: 0.8rem; margin-top: 8px">
          @if (redirect === null) {
            No redirect param — add ?redirect=//evil.com to test open redirect
          } @else if (isDangerous) {
            DANGEROUS: Decoded redirect target — router will follow this path
          } @else {
            Redirect present — router will follow this value
          }
        </div>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (isDangerous ? '#f44' : '#555')"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">SINK — router.navigateByUrl()</div>
        <code [style.color]="isDangerous ? '#f44' : '#888'" style="font-size: 1rem">
          {{ redirect ? 'router.navigateByUrl(' + (redirect | json) + ')' : '(no redirect param)' }}
        </code>
        @if (isDangerous) {
          <div style="color: #f44; font-size: 0.8rem; margin-top: 6px">
            DANGEROUS: Navigating to attacker-controlled destination — open redirect active
          </div>
        }
      </div>

      <div style="background: #111; border-radius: 6px; padding: 1rem; border: 1px solid #333">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 8px">TEST VECTORS</div>
        <div style="line-height: 2">
          <div>
            <a href="/dashboard?redirect=..%2F..%2Fabout" style="color: #f44">
              /dashboard?redirect=..%2F..%2Fabout
            </a>
            <span style="color: #555; font-size: 0.8rem; margin-left: 8px">
              relative traversal via queryParam
            </span>
          </div>
          <div>
            <a href="/dashboard?redirect=/users/1" style="color: #f90">
              /dashboard?redirect=/users/1
            </a>
            <span style="color: #555; font-size: 0.8rem; margin-left: 8px">
              absolute path redirect
            </span>
          </div>
        </div>
      </div>

      @if (!redirect) {
        <div style="margin-top: 1rem; color: #888">
          Dashboard Home — add a <code>?redirect=</code> param to trigger redirect
        </div>
      }
    </div>
  `,
})
export class DashboardIndexComponent implements OnInit {
  redirect: string | null = null;
  isDangerous = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.redirect = params.get('redirect');
      this.isDangerous =
        this.redirect !== null &&
        (this.redirect.startsWith('//') ||
          this.redirect.startsWith('http') ||
          this.redirect.includes('..'));

      if (this.redirect) {
        // SINK: navigateByUrl() with decoded queryParam
        // navigateByUrl() does NOT double-encode like navigate() does
        this.router.navigateByUrl(this.redirect);
      }
    });
  }
}
