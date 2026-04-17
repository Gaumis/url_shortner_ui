import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Shortly' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Shortly');
  });

  it('should render the hero helper text', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-text')?.textContent).toContain('Drop in your full URL');
  });

  it('should request a shortened url from the API for a valid input', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.longUrl = 'https://www.example.com/products/launch?utm=campaign';
    app.shortenUrl();

    const request = httpTesting.expectOne('https://url-shortner.fastapicloud.dev/shorten');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      full_url: 'https://www.example.com/products/launch?utm=campaign'
    });

    request.flush({
      short_url: 'https://url-shortner.fastapicloud.dev/abc123'
    });

    expect(app.shortenedUrl).toBe('https://url-shortner.fastapicloud.dev/abc123');
    expect(app.apiError).toBe('');
  });
});
