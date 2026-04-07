import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JsonPipe } from '@angular/common';

// CSPT Pattern: queryParamMap → HttpClient → bypassSecurityTrustHtml → [innerHTML]
// Risk: CRITICAL — query params decoded + innerHTML renders arbitrary HTML
// URL: /dashboard/stats?widget=../../attachments/malicious
// Angular's built-in sanitizer strips dangerous content from [innerHTML] bindings.
// For CSPT → XSS, the app must call bypassSecurityTrustHtml() on fetched content.
@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div style="padding: 2rem; font-family: monospace; max-width: 700px">
      <h1>queryParamMap — Decoded Source (CRITICAL)</h1>
      <p style="color: #888">
        Source: <code>queryParamMap.get('widget')</code>. Angular decodes query params
        via <code>decodeQuery()</code> which calls <code>decodeURIComponent</code> —
        %2F becomes /. Combined with <code>bypassSecurityTrustHtml</code> +
        <code>[innerHTML]</code>, this is a CSPT + XSS chain.
      </p>

      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">SOURCE</div>
        <code style="color: #f90">this.route.queryParamMap.subscribe(p =&gt; p.get('widget'))</code><br>
        <code style="color: #f90; font-size: 0.85rem">http.get(&#96;/api/widgets/$&#123;widget&#125;&#96;) → bypassSecurityTrustHtml → [innerHTML]</code>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (isDangerous ? '#f44' : (widget ? '#555' : '#333'))"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RAW VALUE from queryParamMap</div>
        <code [style.color]="isDangerous ? '#f44' : '#ccc'" style="font-size: 1.1rem">
          widget = {{ widget | json }}
        </code>
        <div [style.color]="isDangerous ? '#f44' : '#888'" style="font-size: 0.8rem; margin-top: 8px">
          @if (widget === null) {
            No widget param — add ?widget=..%2F..%2Fattachments%2Fmalicious to test
          } @else if (isDangerous) {
            DANGEROUS: %2F was decoded to / — traversal dots visible in value
          } @else {
            Value present but no traversal pattern detected
          }
        </div>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (fetchUrl ? '#f44' : '#555')"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">FETCH URL CONSTRUCTED</div>
        <code [style.color]="fetchUrl ? '#f44' : '#888'" style="font-size: 1rem">
          {{ fetchUrl || '(waiting for widget param)' }}
        </code>
        @if (fetchUrl && isDangerous) {
          <div style="color: #f44; font-size: 0.8rem; margin-top: 6px">
            DANGEROUS: The / in the path came from a decoded %2F — traversal is active
          </div>
        }
      </div>

      <div style="background: #1a1a1a; border: 1px solid #f44; border-radius: 6px; padding: 1rem; margin-bottom: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">SINK — bypassSecurityTrustHtml + [innerHTML] (XSS)</div>
        <div style="color: #f44; font-size: 0.8rem; margin-bottom: 8px">
          The raw HTML response from HttpClient is passed through bypassSecurityTrustHtml
          then rendered via [innerHTML] — if the fetched resource contains HTML/JS, it executes.
        </div>
        <!-- XSS SINK: bypassSecurityTrustHtml + [innerHTML] -->
        <div [innerHTML]="widgetHtml"></div>
        @if (!rawHtml) {
          <span style="color: #555">(no content loaded yet)</span>
        }
      </div>

      <div style="background: #1a1a1a; border: 1px solid #555; border-radius: 6px; padding: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RESULT (raw fetch response text)</div>
        <pre style="margin: 0; color: #ccc; white-space: pre-wrap">{{ rawHtml || '(no content)' }}</pre>
      </div>
    </div>
  `,
})
export class DashboardStatsComponent implements OnInit {
  widget: string | null = null;
  fetchUrl = '';
  rawHtml = '';
  widgetHtml: SafeHtml = '';
  isDangerous = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.widget = params.get('widget');
      this.isDangerous =
        (this.widget?.includes('..') || this.widget?.includes('/')) ?? false;

      if (this.widget) {
        const url = `/api/widgets/${this.widget}`;
        this.fetchUrl = url;

        this.http.get(url, { responseType: 'text' }).subscribe({
          next: (html) => {
            this.rawHtml = html;
            // DANGEROUS: bypassSecurityTrustHtml disables Angular's built-in sanitizer
            this.widgetHtml = this.sanitizer.bypassSecurityTrustHtml(html);
          },
          error: () => {
            this.rawHtml = '<!-- fetch failed (expected — no server) -->';
            this.widgetHtml = this.sanitizer.bypassSecurityTrustHtml(
              this.rawHtml
            );
          },
        });
      }
    });
  }
}
