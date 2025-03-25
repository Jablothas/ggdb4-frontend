import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { DataService } from '../data.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RippleModule,
        AppFloatingConfigurator
    ],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div>
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <!-- Logo + Title -->
                            <svg viewBox="0 0 100 100" class="w-[50px] h-[50px] mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <!-- Thin outer ring -->
                                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary-color)" stroke-width="2" />

                                <!-- Bigger D-Pad shape -->
                                <g fill="var(--primary-color)">
                                    <!-- Vertical bar -->
                                    <rect x="43" y="25" width="14" height="50" />
                                    <!-- Horizontal bar -->
                                    <rect x="25" y="43" width="50" height="14" />
                                </g>
                            </svg>
                            <br>
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">GoodGamesDB</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <input pInputText id="user" type="text" placeholder="Username"
                                   class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password"
                                        [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
                            <br>
                            <p-button label="Sign In" styleClass="w-full" (onClick)="login()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    email: string = '';
    password: string = '';

    constructor(private dataService: DataService, private router: Router) {}

    login(): void {
        const user = { username: this.email, pwd: this.password };

        this.dataService.login(user).subscribe((res: { success: boolean; sessionId?: string; message?: string }) => {
            if (res.success) {
                this.router.navigateByUrl('/');
            } else {
                console.warn('Login failed');
                // You could show a message here with Toast or PrimeNG Message
            }
        });
    }
}
