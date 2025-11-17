// import { inject } from '@angular/core';
// import { HttpInterceptorFn } from '@angular/common/http';
// import { Auth } from '../services/auth/auth';

// export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const auth = inject(Auth);
//   const token = auth.getToken();
//   if (token) {
//     // const clone = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
//     // return next(clone);
//     req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }); 
//   }
//   return next(req);
// };
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/auth/auth';
import { ToastService } from '../shared/toast/toast.service';
import { tap } from 'rxjs/operators';

// export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const auth = inject(Auth);
//   const token = auth.getToken();

//   if (token) {
//     // Refresh last activity on every API call
//     auth.updateLastActivity();

//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }
//   return next(req);
// };


export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.getToken();

  if (token) {
    // add token
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // update last activity
    auth.updateLastActivity();
  }

  return next(req);
};
