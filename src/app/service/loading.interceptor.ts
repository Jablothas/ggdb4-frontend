import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from './loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    console.log('[LoadingInterceptor] Intercepting request:', req.url);
    loadingService.startLoading();

    return next(req).pipe(
        finalize(() => {
            console.log('[LoadingInterceptor] Finalizing request:', req.url);
            loadingService.stopLoading();
        })
    );
};
