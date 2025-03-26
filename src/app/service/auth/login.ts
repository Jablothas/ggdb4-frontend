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
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div>
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <!-- Logo + Title -->
                            <svg id="Ebene_2" data-name="Ebene 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270.5 270.5">
                                <defs>
                                    <style>
                                        .cls-1 {
                                            fill: var(--primary-color);
                                            stroke-width: 0px;
                                        }
                                    </style>
                                </defs>
                                <g id="Ebene_1-2" data-name="Ebene 1">
                                    <g>
                                        <path
                                            class="cls-1"
                                            d="M154.87,270.5h-39.23c-14.04,0-25.46-11.42-25.46-25.46v-63.2c0-.83-.68-1.51-1.51-1.51H25.46c-14.04,0-25.46-11.42-25.46-25.46v-39.23c0-14.04,11.42-25.46,25.46-25.46h63.2c.83,0,1.51-.68,1.51-1.51V25.46c0-14.04,11.42-25.46,25.46-25.46h39.23c14.04,0,25.46,11.42,25.46,25.46v63.2c0,.83.68,1.51,1.51,1.51h63.2c14.04,0,25.46,11.42,25.46,25.46v39.23c0,14.04-11.42,25.46-25.46,25.46h-63.2c-.83,0-1.51.68-1.51,1.51v63.2c0,14.04-11.42,25.46-25.46,25.46ZM25.46,100.17c-8.53,0-15.46,6.94-15.46,15.46v39.23c0,8.53,6.94,15.46,15.46,15.46h63.2c6.35,0,11.51,5.16,11.51,11.51v63.2c0,8.53,6.94,15.46,15.46,15.46h39.23c8.53,0,15.46-6.94,15.46-15.46v-63.2c0-6.35,5.16-11.51,11.51-11.51h63.2c8.53,0,15.46-6.94,15.46-15.46v-39.23c0-8.53-6.94-15.46-15.46-15.46h-63.2c-6.35,0-11.51-5.16-11.51-11.51V25.46c0-8.53-6.94-15.46-15.46-15.46h-39.23c-8.53,0-15.46,6.94-15.46,15.46v63.2c0,6.35-5.16,11.51-11.51,11.51H25.46Z"
                                        />
                                        <circle class="cls-1" cx="135.25" cy="135.25" r="33.87" />
                                        <path class="cls-1" d="M127.07,34.19l-10.94,18.95c-3.63,6.3.91,14.17,8.18,14.17h21.88c7.27,0,11.81-7.87,8.18-14.17l-10.94-18.95c-3.63-6.3-12.72-6.3-16.36,0Z" />
                                        <path class="cls-1" d="M143.43,236.5l10.94-18.95c3.63-6.3-.91-14.17-8.18-14.17h-21.88c-7.27,0-11.81,7.87-8.18,14.17l10.94,18.95c3.63,6.3,12.72,6.3,16.36,0Z" />
                                        <path class="cls-1" d="M34.18,143.43l18.95,10.94c6.3,3.63,14.17-.91,14.17-8.18v-21.88c0-7.27-7.87-11.81-14.17-8.18l-18.95,10.94c-6.3,3.63-6.3,12.72,0,16.36Z" />
                                        <path class="cls-1" d="M236.05,127.07l-18.95-10.94c-6.3-3.63-14.17.91-14.17,8.18v21.88c0,7.27,7.87,11.81,14.17,8.18l18.95-10.94c6.3-3.63,6.3-12.72,0-16.36Z" />
                                    </g>
                                </g>
                            </svg>
                            <br />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">GoodGamesDB</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <input pInputText id="user" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
                            <br />
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

    constructor(
        private dataService: DataService,
        private router: Router
    ) {}

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
