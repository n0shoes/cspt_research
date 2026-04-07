import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

// CSPT Pattern: nested paramMap.get() → HttpClient.get (template literal)
// Risk: HIGH — deeply nested params still decoded by Angular router
// URL: /teams/1%2F2/members/42%2F.. → teamId = "1/2", memberId = "42/.."
@Component({
  selector: 'app-member',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div style="padding: 2rem; font-family: monospace; max-width: 700px">
      <h1>paramMap.get() — Nested Dynamic Params</h1>
      <p style="color: #888">
        Source: <code>paramMap.get('teamId')</code> and <code>paramMap.get('memberId')</code>
        from nested route. HttpClient wraps fetch but decoded params still reach the URL.
        Nesting depth does not add protection.
      </p>

      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">SOURCE</div>
        <code style="color: #f90">paramMap.get('teamId') + paramMap.get('memberId')</code><br>
        <code style="color: #f90; font-size: 0.85rem">this.http.get(&#96;/api/teams/$&#123;teamId&#125;/members/$&#123;memberId&#125;&#96;)</code>
        <div style="color: #888; font-size: 0.75rem; margin-top: 6px">
          Route: <code>/teams/:teamId/members/:memberId</code> — two independent decoded params
        </div>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (isDangerous ? '#f44' : '#4a4')"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RAW VALUES from paramMap</div>

        <div style="margin-bottom: 8px">
          <code [style.color]="teamDangerous ? '#f44' : '#4a4'" style="font-size: 1rem">
            teamId = {{ teamId | json }}
          </code>
          @if (teamDangerous) {
            <span style="margin-left: 8px; color: #f44; font-size: 0.75rem">DANGEROUS</span>
          }
        </div>

        <div>
          <code [style.color]="memberDangerous ? '#f44' : '#4a4'" style="font-size: 1rem">
            memberId = {{ memberId | json }}
          </code>
          @if (memberDangerous) {
            <span style="margin-left: 8px; color: #f44; font-size: 0.75rem">DANGEROUS</span>
          }
        </div>

        <div [style.color]="isDangerous ? '#f44' : '#4a4'" style="font-size: 0.8rem; margin-top: 8px">
          {{ isDangerous
            ? 'DANGEROUS: Decoded — %2F became /, traversal active in nested param'
            : 'No traversal — try /teams/1%2F2/members/42 to test :teamId' }}
        </div>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (isDangerous ? '#f44' : '#555')"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">FETCH URL CONSTRUCTED (via HttpClient)</div>
        <code [style.color]="isDangerous ? '#f44' : '#ccc'" style="font-size: 1rem">
          {{ fetchUrl || 'loading...' }}
        </code>
        @if (isDangerous) {
          <div style="color: #f44; font-size: 0.8rem; margin-top: 6px">
            DANGEROUS: HttpClient does not sanitize paths — decoded param injected directly
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
export class MemberComponent implements OnInit {
  teamId = '';
  memberId = '';
  fetchUrl = '';
  result: unknown = null;
  teamDangerous = false;
  memberDangerous = false;
  isDangerous = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.teamId = params.get('teamId') ?? '';
      this.memberId = params.get('memberId') ?? '';

      this.teamDangerous =
        this.teamId.includes('..') || this.teamId.includes('/');
      this.memberDangerous =
        this.memberId.includes('..') || this.memberId.includes('/');
      this.isDangerous = this.teamDangerous || this.memberDangerous;

      const url = `/api/teams/${this.teamId}/members/${this.memberId}`;
      this.fetchUrl = url;

      this.http.get(url).subscribe({
        next: (data) => (this.result = data),
        error: () =>
          (this.result = { error: 'fetch failed (expected — no server)' }),
      });
    });
  }
}
