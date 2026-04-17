import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'https://url-shortner.fastapicloud.dev';

  title = 'Shortly';
  longUrl = '';
  shortenedUrl = '';
  copied = false;
  submitted = false;
  isSubmitting = false;
  apiError = '';
  readonly sampleShortUrl = 'https://url-shortner.fastapicloud.dev/abc123';

  get hasValidUrl(): boolean {
    return this.parseUrl(this.longUrl) !== null;
  }

  shortenUrl(): void {
    this.submitted = true;
    this.apiError = '';
    this.copied = false;

    const parsedUrl = this.parseUrl(this.longUrl);
    if (!parsedUrl) {
      return;
    }

    this.isSubmitting = true;
    this.shortenedUrl = '';

    this.http
      .post<{ short_url: string }>(`${this.apiBaseUrl}/shorten`, {
        full_url: parsedUrl.toString()
      })
      .subscribe({
        next: ({ short_url }) => {
          this.shortenedUrl = short_url;
          this.isSubmitting = false;
        },
        error: (error: HttpErrorResponse) => {
          this.apiError = this.getErrorMessage(error);
          this.isSubmitting = false;
        }
      });
  }

  async copyShortUrl(): Promise<void> {
    if (!this.shortenedUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.shortenedUrl);
      this.copied = true;
    } catch {
      this.copied = false;
    }
  }

  private parseUrl(value: string): URL | null {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return null;
    }

    try {
      return new URL(trimmedValue);
    } catch {
      return null;
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'The browser could not reach the API. This is usually a CORS or network issue on the backend.';
    }

    return (
      error.error?.detail?.[0]?.msg ??
      error.error?.detail ??
      error.error?.message ??
      `Request failed with status ${error.status}.`
    );
  }
}
