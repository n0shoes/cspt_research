import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div style="padding: 2rem; font-family: monospace">
      <h1>About</h1>
      <p style="color: #888">Static page — no user-controlled params in fetch URL.</p>
      <pre style="color: #ccc">{{ data | json }}</pre>
    </div>
  `,
})
export class AboutComponent implements OnInit {
  data: unknown = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get('/api/about')
      .subscribe({
        next: (d) => (this.data = d),
        error: () => (this.data = { error: 'fetch failed (expected — no server)' }),
      });
  }
}
