import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, JsonPipe } from '@angular/common';

// Encoding diagnostic — shows how Angular Router treats each source
// Navigate here with encoded characters to observe decoding behavior
// e.g., /encoding-test/hello%2Fworld?q=test%2Fvalue#my%2Fhash
@Component({
  selector: 'app-encoding-test',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div style="padding: 2rem; font-family: monospace; max-width: 900px">
      <h1>Encoding Diagnostic — paramMap vs location</h1>
      <p style="color: #888">
        Angular Router encoding behavior for each param source. Navigate with
        <code>%2F</code> in different positions to observe which sources decode it.
      </p>

      <div style="background: #111; border: 1px solid #f90; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem">
        <div style="color: #f90; font-weight: bold; margin-bottom: 6px">Key Finding</div>
        <div style="color: #ccc; font-size: 0.9rem; line-height: 1.7">
          Angular's <code>SEGMENT_RE</code> splits on literal <code>/</code> first (before decoding),
          so <code>%2F</code> stays within a single segment during route matching. However,
          <code>decode()</code> = <code>decodeURIComponent()</code> is called on the segment
          BEFORE storing in <code>paramMap</code>.
          <span style="color: #f44">
            paramMap.get() returns fully decoded values including slashes — CSPT works identically
            to React Router at the HTTP layer.
          </span>
        </div>
      </div>

      <div style="background: #111; border-radius: 8px; border: 1px solid #333; overflow: hidden; margin-bottom: 1.5rem">
        <table style="width: 100%; border-collapse: collapse">
          <thead>
            <tr style="background: #1a1a1a">
              <th style="text-align: left; padding: 0.6rem 1rem; color: #888; font-weight: normal; font-size: 0.8rem; border-bottom: 1px solid #333">Source</th>
              <th style="text-align: left; padding: 0.6rem 1rem; color: #888; font-weight: normal; font-size: 0.8rem; border-bottom: 1px solid #333">Value</th>
              <th style="text-align: left; padding: 0.6rem 1rem; color: #888; font-weight: normal; font-size: 0.8rem; border-bottom: 1px solid #333">Status</th>
              <th style="text-align: left; padding: 0.6rem 1rem; color: #888; font-weight: normal; font-size: 0.8rem; border-bottom: 1px solid #333">Notes</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.label; let i = $index) {
              <tr [style.border-bottom]="i < rows.length - 1 ? '1px solid #222' : 'none'">
                <td style="padding: 0.6rem 1rem">
                  <code style="color: #f90">{{ row.label }}</code>
                </td>
                <td style="padding: 0.6rem 1rem">
                  <code [style.color]="row.dangerous ? '#f44' : '#4a4'" style="word-break: break-all">
                    {{ row.value | json }}
                  </code>
                </td>
                <td style="padding: 0.6rem 1rem">
                  <span [style.color]="row.dangerous ? '#f44' : '#4a4'" style="font-size: 0.8rem; font-weight: bold">
                    {{ row.dangerous ? 'DANGEROUS' : 'SAFE' }}
                  </span>
                </td>
                <td style="padding: 0.6rem 1rem; color: #888; font-size: 0.8rem">
                  {{ row.note }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div style="background: #111; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">
          CONSOLE OUTPUT (check DevTools console for JSON)
        </div>
        <pre style="margin: 0; color: #ccc; font-size: 0.8rem; white-space: pre-wrap">{{ consoleOutput }}</pre>
      </div>

      <div style="color: #888; font-size: 0.85rem">
        <strong style="color: #ccc">Test URLs:</strong>
        <ul style="margin-top: 8px; line-height: 2">
          <li>
            <a href="/encoding-test/hello%2Fworld">/encoding-test/hello%2Fworld</a>
            — %2F in path param
          </li>
          <li>
            <a href="/encoding-test/..%2F..%2Fapi%2Fsecret">/encoding-test/..%2F..%2Fapi%2Fsecret</a>
            — traversal payload
          </li>
          <li>
            <a href="/encoding-test/hello%252Fworld">/encoding-test/hello%252Fworld</a>
            — double-encoded %2F
          </li>
          <li>
            <a href="/encoding-test/normal?q=test%2Fvalue">/encoding-test/normal?q=test%2Fvalue</a>
            — %2F in query param
          </li>
          <li>
            <a href="/encoding-test/normal#../../admin">/encoding-test/normal#../../admin</a>
            — traversal in hash
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class EncodingTestComponent implements OnInit {
  rows: {
    label: string;
    value: unknown;
    dangerous: boolean;
    note: string;
  }[] = [];
  consoleOutput = '';
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const testParam = params.get('testParam');
      const qParam = this.route.snapshot.queryParamMap.get('q');
      const routerUrl = this.router.url;

      const windowPathname = this.isBrowser
        ? window.location.pathname
        : 'N/A';
      const windowSearch = this.isBrowser ? window.location.search : 'N/A';
      const windowHash = this.isBrowser ? window.location.hash : 'N/A';
      const windowHref = this.isBrowser ? window.location.href : 'N/A';

      // Also show snapshot.params for comparison
      const snapshotParam =
        this.route.snapshot.paramMap.get('testParam');

      this.rows = [
        {
          label: "paramMap.get('testParam')",
          value: testParam,
          dangerous:
            (testParam?.includes('/') || testParam?.includes('..')) ?? false,
          note: 'DECODED via decodeURIComponent — %2F becomes /',
        },
        {
          label: "snapshot.paramMap.get('testParam')",
          value: snapshotParam,
          dangerous:
            (snapshotParam?.includes('/') || snapshotParam?.includes('..')) ??
            false,
          note: 'Same as paramMap — both decoded',
        },
        {
          label: "queryParamMap.get('q')",
          value: qParam,
          dangerous:
            (qParam?.includes('/') || qParam?.includes('..')) ?? false,
          note: 'DECODED via decodeQuery() — includes + → space handling',
        },
        {
          label: 'router.url',
          value: routerUrl,
          dangerous: false,
          note: 'Serialized URL from router — partially encoded',
        },
        {
          label: 'window.location.pathname',
          value: windowPathname,
          dangerous: false,
          note: 'SAFE — browser preserves %2F encoding in pathname',
        },
        {
          label: 'window.location.search',
          value: windowSearch,
          dangerous: false,
          note: 'Raw search string — still encoded at this level',
        },
        {
          label: 'window.location.hash',
          value: windowHash,
          dangerous: windowHash?.includes('..') ?? false,
          note: 'Raw hash — literal ../ works without encoding',
        },
        {
          label: 'window.location.href',
          value: windowHref,
          dangerous: false,
          note: 'Full URL — encoding status depends on browser',
        },
      ];

      const results = Object.fromEntries(
        this.rows.map((r) => [r.label, r.value])
      );
      this.consoleOutput = JSON.stringify(results, null, 2);
      console.log('[ENCODING_TEST]', JSON.stringify(results, null, 2));
    });
  }
}
