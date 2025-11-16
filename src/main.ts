import { bootstrapApplication } from '@angular/platform-browser';
import AppComponent from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './app/interceptors/token-interceptor';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     importProvidersFrom(HttpClientModule)
//   ]
// });


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),

    // ✅ Register your interceptor properly
    provideHttpClient(
      withInterceptors([TokenInterceptor])
    )
  ]
});


