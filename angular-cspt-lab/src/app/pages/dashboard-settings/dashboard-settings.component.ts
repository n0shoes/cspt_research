import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { JsonPipe } from '@angular/common';

// CSPT Pattern: queryParamMap → ApiService.get (wrapper sink)
// Risk: HIGH — query params decoded, service layer hides the fetch sink
// URL: /dashboard/settings?section=../../admin/users
// Also demonstrates: window.location.hash as alternative source
@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div style="padding: 2rem; font-family: monospace; max-width: 700px">
      <h1>queryParamMap + location.hash — Service Layer Sink</h1>
      <p style="color: #888">
        Two sources demonstrated: <code>queryParamMap.get('section')</code> and
        <code>window.location.hash</code>. Both flow through <code>ApiService.get()</code>
        which wraps HttpClient — the service layer abstraction hides the fetch sink.
        Hash fragments are never URL-decoded by the browser — literal <code>../../admin</code> works directly.
      </p>

      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">SOURCE</div>
        <code style="color: #f90">queryParamMap.get('section') OR window.location.hash.slice(1)</code><br>
        <code style="color: #f90; font-size: 0.85rem">apiService.get(path) → http.get(&#96;/api/$&#123;path&#125;&#96;)</code>
        <div style="color: #888; font-size: 0.8rem; margin-top: 6px">
          Note: Service layer hides the fetch sink — common real-world pattern
        </div>
      </div>

      <!-- Query Param Source -->
      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (sectionDangerous ? '#f44' : (section ? '#555' : '#333'))"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RAW VALUE from queryParamMap (source 1)</div>
        <code [style.color]="sectionDangerous ? '#f44' : '#ccc'" style="font-size: 1.1rem">
          section = {{ section | json }}
        </code>
        <div [style.color]="sectionDangerous ? '#f44' : '#888'" style="font-size: 0.8rem; margin-top: 8px">
          @if (section === null) {
            No section param — add ?section=../../admin/users to test traversal
          } @else if (sectionDangerous) {
            DANGEROUS: Decoded query param — traversal active via queryParamMap
          } @else {
            Section present but no traversal pattern detected
          }
        </div>
      </div>

      <!-- Hash Source -->
      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (hashDangerous ? '#f44' : (hashPath ? '#555' : '#333'))"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RAW VALUE from location.hash (source 2)</div>
        <code [style.color]="hashDangerous ? '#f44' : '#ccc'" style="font-size: 1.1rem">
          hash = {{ hashPath | json }}
        </code>
        <div [style.color]="hashDangerous ? '#f44' : '#888'" style="font-size: 0.8rem; margin-top: 8px">
          @if (!hashPath) {
            No hash — navigate to #../../admin/users to test traversal
          } @else if (hashDangerous) {
            DANGEROUS: Literal ../ in hash — no encoding needed, direct traversal
          } @else {
            Hash present but no traversal pattern detected
          }
        </div>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (fetchUrl ? '#f44' : '#555')"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">FETCH URL CONSTRUCTED (inside ApiService.get)</div>
        <code [style.color]="fetchUrl ? '#f44' : '#888'" style="font-size: 1rem">
          {{ fetchUrl || '(waiting for section or hash)' }}
        </code>
        @if (fetchUrl && (sectionDangerous || hashDangerous)) {
          <div style="color: #f44; font-size: 0.8rem; margin-top: 6px">
            DANGEROUS: Path traversal segments passed to fetch via service layer
          </div>
        }
      </div>

      <div style="background: #1a1a1a; border: 1px solid #555; border-radius: 6px; padding: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RESULT from ApiService</div>
        <pre style="margin: 0; color: #ccc">{{ result | json }}</pre>
      </div>
    </div>
  `,
})
export class DashboardSettingsComponent implements OnInit {
  section: string | null = null;
  hashPath = '';
  fetchUrl = '';
  result: unknown = null;
  sectionDangerous = false;
  hashDangerous = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Source 1: queryParamMap
    this.route.queryParamMap.subscribe((params) => {
      this.section = params.get('section');
      this.sectionDangerous =
        (this.section?.includes('..') || this.section?.includes('/')) ?? false;

      if (this.section) {
        this.fetchUrl = `/api/settings/${this.section}`;
        this.apiService.get<unknown>(`settings/${this.section}`).subscribe({
          next: (data) => (this.result = data),
          error: () =>
            (this.result = { error: 'fetch failed (expected — no server)' }),
        });
      }
    });

    // Source 2: window.location.hash
    const hash = window.location.hash.slice(1); // remove '#'
    this.hashPath = hash;
    this.hashDangerous = hash.includes('..');

    if (hash && !this.section) {
      this.fetchUrl = `/api/${hash}`;
      this.apiService.get<unknown>(hash).subscribe({
        next: (data) => (this.result = data),
        error: () =>
          (this.result = { error: 'fetch failed (expected — no server)' }),
      });
    }
  }
}
