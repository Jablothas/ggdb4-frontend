import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private loadingCount = 0;
    private loadingSubject = new BehaviorSubject<boolean>(false);

    loading$ = this.loadingSubject.asObservable();

    startLoading(): void {
        this.loadingCount++;
        this.loadingSubject.next(true);
    }

    stopLoading(): void {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        this.loadingSubject.next(this.loadingCount > 0);
    }
}
