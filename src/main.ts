import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
        ...appConfig.providers,
        importProvidersFrom(ToastModule),
        MessageService
    ]
}).catch((err) => console.error(err));
