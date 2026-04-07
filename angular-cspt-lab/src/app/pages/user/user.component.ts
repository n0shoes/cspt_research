import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

// CSPT Pattern: paramMap.get() → HttpClient.get template literal
// Risk: HIGH — Angular decodes paramMap values via decodeURIComponent()
// URL: /users/..%2Fapi%2Fsecret → userId = "../api/secret" → GET /api/users/../api/secret
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div style="padding: 2rem; font-family: monospace; max-width: 700px">
      <h1>paramMap.get() — Single Dynamic Param</h1>
      <p style="color: #888">
        Source: <code>paramMap.get('userId')</code>. Angular's router calls
        <code>decodeURIComponent()</code> on matched segments — %2F becomes /,
        so traversal works directly when interpolated into an API URL.
      </p>

      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">SOURCE</div>
        <code style="color: #f90">this.route.paramMap.subscribe(p =&gt; p.get('userId'))</code>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (isDangerous ? '#f44' : '#4a4')"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RAW VALUE from paramMap</div>
        <code [style.color]="isDangerous ? '#f44' : '#4a4'" style="font-size: 1.1rem">
          userId = {{ userId | json }}
        </code>
        <div [style.color]="isDangerous ? '#f44' : '#4a4'" style="font-size: 0.8rem; margin-top: 6px">
          {{ isDangerous
            ? 'DANGEROUS: %2F was decoded to / — path traversal is active'
            : 'No traversal pattern — try /users/..%2Fapi%2Fsecret to test' }}
        </div>
        <div style="color: #888; font-size: 0.75rem; margin-top: 4px">
          Angular calls decodeURIComponent() on every path param segment
        </div>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (isDangerous ? '#f44' : '#555')"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">FETCH URL CONSTRUCTED</div>
        <code [style.color]="isDangerous ? '#f44' : '#ccc'" style="font-size: 1rem">
          {{ fetchUrl || 'loading...' }}
        </code>
        @if (isDangerous) {
          <div style="color: #f44; font-size: 0.8rem; margin-top: 6px">
            DANGEROUS: The / in the path came from a decoded %2F — traversal is active
          </div>
        }
      </div>

      <div style="background: #1a1a1a; border: 1px solid #555; border-radius: 6px; padding: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RESULT from HttpClient</div>
        <pre style="margin: 0; color: #ccc">{{ result | json }}</pre>
      </div>
    </div>
  `,
})
export class UserComponent implements OnInit {
  userId = '';
  fetchUrl = '';
  result: unknown = null;
  isDangerous = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') ?? '';
      this.isDangerous =
        this.userId.includes('..') || this.userId.includes('/');

      const url = `/api/users/${this.userId}`;
      this.fetchUrl = url;

      this.http.get(url).subscribe({
        next: (data) => (this.result = data),
        error: () =>
          (this.result = { error: 'fetch failed (expected — no server)' }),
      });
    });
  }
}
