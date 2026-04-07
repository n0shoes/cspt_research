import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

// CSPT Pattern: multiple paramMap.get() → HttpClient concatenation
// Risk: HIGH — both params decoded, either can carry traversal
// URL: /shop/electronics%2Fhacked/99 → category = "electronics/hacked"
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div style="padding: 2rem; font-family: monospace; max-width: 700px">
      <h1>paramMap.get() — Multiple Params</h1>
      <p style="color: #888">
        Source: <code>paramMap.get('category')</code> and <code>paramMap.get('productId')</code>.
        Angular decodes all path params — either one can carry a traversal payload.
      </p>

      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem">
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">SOURCE</div>
        <code style="color: #f90">paramMap.get('category') + paramMap.get('productId')</code><br>
        <code style="color: #f90; font-size: 0.85rem">'/api/shop/' + category + '/products/' + productId</code>
      </div>

      <div
        style="background: #1a1a1a; border-radius: 6px; padding: 1rem; margin-bottom: 1rem"
        [style.border]="'1px solid ' + (isDangerous ? '#f44' : '#4a4')"
      >
        <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px">RAW VALUES from paramMap</div>

        <div style="margin-bottom: 8px">
          <code [style.color]="categoryDangerous ? '#f44' : '#4a4'" style="font-size: 1rem">
            category = {{ category | json }}
          </code>
          @if (categoryDangerous) {
            <span style="margin-left: 8px; color: #f44; font-size: 0.75rem">DANGEROUS — decoded</span>
          }
        </div>

        <div>
          <code [style.color]="productDangerous ? '#f44' : '#4a4'" style="font-size: 1rem">
            productId = {{ productId | json }}
          </code>
          @if (productDangerous) {
            <span style="margin-left: 8px; color: #f44; font-size: 0.75rem">DANGEROUS — decoded</span>
          }
        </div>

        <div [style.color]="isDangerous ? '#f44' : '#4a4'" style="font-size: 0.8rem; margin-top: 8px">
          {{ isDangerous
            ? 'DANGEROUS: At least one param was decoded — traversal active'
            : 'No traversal — try /shop/electronics%2Fhacked/99 to test :category' }}
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
            DANGEROUS: Decoded param injected into URL — traversal is active
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
export class ProductComponent implements OnInit {
  category = '';
  productId = '';
  fetchUrl = '';
  result: unknown = null;
  categoryDangerous = false;
  productDangerous = false;
  isDangerous = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category') ?? '';
      this.productId = params.get('productId') ?? '';

      this.categoryDangerous =
        this.category.includes('..') || this.category.includes('/');
      this.productDangerous =
        this.productId.includes('..') || this.productId.includes('/');
      this.isDangerous = this.categoryDangerous || this.productDangerous;

      const url =
        '/api/shop/' + this.category + '/products/' + this.productId;
      this.fetchUrl = url;

      this.http.get(url).subscribe({
        next: (data) => (this.result = data),
        error: () =>
          (this.result = { error: 'fetch failed (expected — no server)' }),
      });
    });
  }
}
