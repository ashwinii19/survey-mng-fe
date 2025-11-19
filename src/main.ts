// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideRouter } from '@angular/router';
// import { routes } from './app/app.routes';
// import { importProvidersFrom } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { TokenInterceptor } from './app/interceptors/token-interceptor';

// // bootstrapApplication(AppComponent, {
// //   providers: [
// //     provideRouter(routes),
// //     importProvidersFrom(HttpClientModule)
// //   ]
// // });


// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     importProvidersFrom(HttpClientModule),

//     // ✅ Register your interceptor properly
//     provideHttpClient(
//       withInterceptors([TokenInterceptor])
//     )
//   ]
// });


// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideRouter } from '@angular/router';
// import { routes } from './app/app.routes';

// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { TokenInterceptor } from './app/interceptors/token-interceptor';

// bootstrapApplication(AppComponent, {
//   providers: [

//     // Router
//     provideRouter(routes),

//     // Http + Token Interceptor
//     provideHttpClient(
//       withInterceptors([TokenInterceptor])
//     )
//   ]
// });

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './app/interceptors/token-interceptor';

// Chart.js + DataLabels Plugin
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// REGISTER THE PLUGIN GLOBALLY
Chart.register(ChartDataLabels);

bootstrapApplication(AppComponent, {
  providers: [

    // Router
    provideRouter(routes),

    // HTTP Client + JWT Interceptor
    provideHttpClient(
      withInterceptors([TokenInterceptor])
    )
  ]
});
