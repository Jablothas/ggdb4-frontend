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
import { Dialog } from 'primeng/dialog';


@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, ToastModule, Dialog],
    templateUrl: 'app.topbar.html'
})
export class AppTopbar {
    constructor(
        public layoutService: LayoutService,
        private dataService: DataService,
        private loginService: LoginService,
        private router: Router
    ) {}

    showLegend = false;

    openLegend(): void {
        this.showLegend = true;
    }

    openOverview() {
        this.router.navigate(['/overview']);
    }

    openAdd(): void {
        this.router.navigate(['/detail'], {
            queryParams: { record: 'new' }
        });
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
