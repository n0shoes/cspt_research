import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    @if (isHome) {
      <div style="padding: 2rem; font-family: monospace; max-width: 900px; margin: 0 auto">
        <h1>Angular Router CSPT Lab</h1>
        <p style="color: #888; margin-bottom: 1rem">
          Client-Side Path Traversal research lab — Angular 21.2.1 (standalone SPA)
        </p>

        <!-- Key Finding -->
        <div style="padding: 1rem; background: #111; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #333">
          <h3 style="margin: 0 0 0.5rem; color: #f90">
            Key Finding: Angular paramMap Decodes %2F to /
          </h3>
          <p style="margin: 0; color: #ccc; line-height: 1.6">
            Angular's <code>SEGMENT_RE</code> splits on literal <code>/</code> first
            (preserving <code>%2F</code> within segments), but
            <code>decode()</code> = <code>decodeURIComponent()</code> runs BEFORE
            storing in <code>paramMap</code>.
            <span style="color: #f44">paramMap.get() returns fully decoded values</span>
            — CSPT works identically to React at the HTTP layer.
            <br>
            <code>queryParamMap</code> has a
            <span style="color: #f44">LARGER</span> attack surface because query
            params are never split on <code>/</code>.
            <br>
            Angular's <code>[innerHTML]</code> is safe by default — the XSS chain
            requires <code>bypassSecurityTrustHtml()</code>.
            <br>
            <code>router.navigate()</code>
            <span style="color: #f90">double-encodes</span> % characters —
            <code>navigateByUrl()</code> is the more dangerous sink.
          </p>
        </div>

        <!-- DANGEROUS SOURCES -->
        <div style="padding: 1rem; background: #1a0000; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #f44">
          <h2 style="margin: 0 0 0.75rem; color: #f44">DANGEROUS SOURCES (decode %2F to /)</h2>
          <p style="color: #888; font-size: 0.85rem; margin: 0 0 0.75rem">
            These sources return a decoded value — %2F becomes / before your TypeScript
            sees it. Combined with an HttpClient sink, path traversal is possible.
          </p>

          <table style="width: 100%; border-collapse: collapse">
            <thead>
              <tr>
                <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem">Source</th>
                <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem">Demo</th>
                <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem 0; color: #f44">
                  <code>paramMap.get()</code><br>
                  <span style="font-size: 0.75rem; color: #888">all path params</span>
                </td>
                <td style="padding: 0.5rem 0.5rem">
                  <a href="/users/..%2Fapi%2Fsecret" style="color: #f44">/users/..%2Fapi%2Fsecret</a>
                </td>
                <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem">
                  paramMap → HttpClient — %2F decoded to / before TS sees it
                </td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #f44">
                  <code>queryParamMap.get()</code><br>
                  <span style="font-size: 0.75rem; color: #888">query params (bigger surface)</span>
                </td>
                <td style="padding: 0.5rem 0.5rem">
                  <a href="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious" style="color: #f44">/dashboard/stats?widget=...</a>
                </td>
                <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem">
                  CRITICAL — CSPT + bypassSecurityTrustHtml → XSS chain
                </td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #f44">
                  <code>queryParamMap.get()</code><br>
                  <span style="font-size: 0.75rem; color: #888">service layer sink</span>
                </td>
                <td style="padding: 0.5rem 0.5rem">
                  <a href="/dashboard/settings?section=../../admin/users" style="color: #f44">/dashboard/settings?section=...</a>
                </td>
                <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem">
                  queryParam → ApiService.get() — service layer hides sink
                </td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #f44">
                  <code>location.hash</code>
                </td>
                <td style="padding: 0.5rem 0.5rem">
                  <a href="/dashboard/settings#../../admin/users" style="color: #f44">/dashboard/settings#../../admin/users</a>
                </td>
                <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem">
                  Literal ../ in hash, flows through service layer → HttpClient
                </td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #f44">
                  <code>queryParamMap.get()</code><br>
                  <span style="font-size: 0.75rem; color: #888">open redirect</span>
                </td>
                <td style="padding: 0.5rem 0.5rem">
                  <a href="/dashboard?redirect=..%2F..%2Fabout" style="color: #f44">/dashboard?redirect=...</a>
                </td>
                <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem">
                  queryParam → navigateByUrl() open redirect sink
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SAFE SOURCES -->
        <div style="padding: 1rem; background: #001a00; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #4a4">
          <h2 style="margin: 0 0 0.75rem; color: #4a4">SAFE SOURCES (preserve %2F encoding)</h2>
          <p style="color: #888; font-size: 0.85rem; margin: 0 0 0.75rem">
            These sources preserve %2F — the value you get in TypeScript still
            contains %2F, so it cannot cross path boundaries when used in an API URL.
          </p>
          <table style="width: 100%; border-collapse: collapse">
            <thead>
              <tr>
                <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem">Source</th>
                <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem">Demo</th>
                <th style="text-align: left; color: #888; font-weight: normal; padding-bottom: 0.5rem; border-bottom: 1px solid #333; font-size: 0.8rem">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem 0; color: #4a4">
                  <code>window.location.pathname</code>
                </td>
                <td style="padding: 0.5rem 0.5rem">
                  <a href="/encoding-test/test%2Fpath" style="color: #4a4">/encoding-test/test%2Fpath</a>
                </td>
                <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem">
                  Browser-native — preserves %2F, safe to use directly in API URL
                </td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; color: #4a4">
                  <code>router.url</code>
                </td>
                <td style="padding: 0.5rem 0.5rem">
                  <a href="/encoding-test/test%2Fpath" style="color: #4a4">/encoding-test/test%2Fpath</a>
                </td>
                <td style="padding: 0.5rem 0; color: #888; font-size: 0.8rem">
                  Serialized UrlTree — partially encoded, not fully decoded
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Angular-Specific Notes -->
        <div style="padding: 1rem; background: #111; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #f90">
          <h2 style="margin: 0 0 0.75rem; color: #f90">Angular-Specific Behavior</h2>
          <ul style="color: #ccc; line-height: 2; margin: 0; padding-left: 1.5rem">
            <li>
              <strong style="color: #f90">No splat/catch-all with params:</strong>
              Angular's <code>**</code> wildcard consumes all segments but does NOT
              capture sub-paths as a parameter (unlike React's <code>*</code>)
            </li>
            <li>
              <strong style="color: #f90">%2F preservation during routing:</strong>
              <code>SEGMENT_RE = /^[^\\/()?;#]+/</code> treats %2F as 3 chars (%,2,F),
              keeping the full traversal payload in ONE segment
            </li>
            <li>
              <strong style="color: #f90">Query params = bigger surface:</strong>
              Query param values match <code>/^[^&amp;#]]+/</code> — never split on <code>/</code>
            </li>
            <li>
              <strong style="color: #f90">router.navigate() double-encodes:</strong>
              <code>encodeUriSegment()</code> re-encodes <code>%</code> to <code>%25</code> —
              use <code>navigateByUrl()</code> for string injection
            </li>
            <li>
              <strong style="color: #f90">[innerHTML] is safe by default:</strong>
              Angular's sanitizer strips dangerous content — requires
              <code>bypassSecurityTrustHtml()</code> for XSS chain
            </li>
          </ul>
        </div>

        <!-- Encoding Diagnostics -->
        <h2 style="color: #ccc">Encoding Diagnostics</h2>
        <ul style="line-height: 2.2">
          <li>
            <a href="/encoding-test/hello%2Fworld" style="font-weight: bold">/encoding-test/:testParam</a>
            <code style="margin-left: 8px; font-size: 0.8rem; color: #f44; font-weight: bold">
              paramMap vs location.pathname encoding comparison
            </code>
          </li>
        </ul>

        <!-- All Routes -->
        <h2 style="color: #ccc">All Routes</h2>
        <ul style="line-height: 2.2">
          <li>
            <a href="/users/..%2Fapi%2Fsecret" style="color: #f44">/users/:userId</a>
            <code style="margin-left: 8px; font-size: 0.8rem; color: #888">
              paramMap → HttpClient (DANGEROUS)
            </code>
          </li>
          <li>
            <a href="/shop/electronics%2Fhacked/99" style="color: #f44">/shop/:category/:productId</a>
            <code style="margin-left: 8px; font-size: 0.8rem; color: #888">
              multi-param paramMap → HttpClient (DANGEROUS)
            </code>
          </li>
          <li>
            <a href="/teams/1%2F2/members/42" style="color: #f44">/teams/:teamId/members/:memberId</a>
            <code style="margin-left: 8px; font-size: 0.8rem; color: #888">
              nested params → HttpClient (DANGEROUS)
            </code>
          </li>
          <li>
            <a href="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious" style="color: #f44">/dashboard/stats</a>
            <code style="margin-left: 8px; font-size: 0.8rem; color: #888">
              queryParamMap → HttpClient → bypassSecurityTrustHtml (CRITICAL)
            </code>
          </li>
          <li>
            <a href="/dashboard/settings?section=../../admin/users" style="color: #f44">/dashboard/settings</a>
            <code style="margin-left: 8px; font-size: 0.8rem; color: #888">
              queryParamMap → ApiService wrapper (DANGEROUS)
            </code>
          </li>
          <li>
            <a href="/dashboard/settings#../../admin/users" style="color: #f44">/dashboard/settings#...</a>
            <code style="margin-left: 8px; font-size: 0.8rem; color: #888">
              location.hash → service layer → HttpClient (DANGEROUS)
            </code>
          </li>
          <li>
            <a href="/dashboard?redirect=..%2F..%2Fabout" style="color: #f44">/dashboard</a>
            <code style="margin-left: 8px; font-size: 0.8rem; color: #888">
              queryParamMap → navigateByUrl() open redirect (DANGEROUS)
            </code>
          </li>
          <li>
            <a href="/about">/about</a>
            <code style="margin-left: 8px; font-size: 0.8rem; color: #888">
              static page with HttpClient fetch
            </code>
          </li>
        </ul>
      </div>
    } @else {
      <router-outlet />
    }
  `,
  styles: [],
})
export class App {
  get isHome(): boolean {
    return this.router.url === '/';
  }

  constructor(private router: Router) {}
}
