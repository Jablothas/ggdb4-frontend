import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../service/layout.service';
import { DataService } from '../../service/data.service';
import { LoginService } from '../../service/login.service';
import { ToastModule } from 'primeng/toast';
import { LoadingService } from '../../service/loading.service';
import { ProgressBar } from 'primeng/progressbar';
import { VersionService } from '../../service/version.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, ToastModule, ProgressBar],
    templateUrl: 'app.topbar.html'
})
export class AppTopbar {
    isLoading$;
    version: string;

    constructor(
        public layoutService: LayoutService,
        private dataService: DataService,
        private loginService: LoginService,
        private router: Router,
        private loadingService: LoadingService,
        private versionService: VersionService
    ) {
        this.isLoading$ = this.loadingService.loading$;
        this.version = this.versionService.getVersion();
    }

    ngOnInit() {
        this.isLoading$.subscribe(v => console.log('Loading:', v));
    }

    isActive(path: string): boolean {
        return this.router.url === path;
    }

    openOverview() {
        this.router.navigate(['/overview']);
    }

    openDashboard(): void {
        this.router.navigate(['/']);
    }

    openProfile(): void {
        this.router.navigate(['/profile']);
    }

    logout(): void {
        const username = this.loginService.getUsername();

        if (username) {
            this.dataService.logout(username).subscribe(() => {
                this.router.navigate(['/auth/login']);
            });
        } else {
            this.router.navigate(['/auth/login']);
        }
    }
}
