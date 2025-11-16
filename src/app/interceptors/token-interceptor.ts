// import { inject } from '@angular/core';
// import { HttpInterceptorFn } from '@angular/common/http';
// import { Auth } from '../services/auth/auth';

// export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const auth = inject(Auth);
//   const token = auth.getToken();
//   if (token) {
//     const clone = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
//     return next(clone);
//   }
//   return next(req);
// };
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/auth/auth';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};

