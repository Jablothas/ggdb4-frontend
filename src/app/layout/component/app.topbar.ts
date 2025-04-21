import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../../layout/component/app.configurator';
import { LayoutService } from '../service/layout.service';
import { DataService } from '../../service/data.service';
import { LoginService } from '../../service/login.service';
import { ToastModule } from 'primeng/toast';
import { LoadingService } from '../../service/loading.service';
import { ProgressBar } from 'primeng/progressbar';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, ToastModule, ProgressBar],
    templateUrl: 'app.topbar.html'
})
export class AppTopbar {
    isLoading$;

    constructor(
        public layoutService: LayoutService,
        private dataService: DataService,
        private loginService: LoginService,
        private router: Router,
        private loadingService: LoadingService
    ) {
        this.isLoading$ = this.loadingService.loading$;
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
