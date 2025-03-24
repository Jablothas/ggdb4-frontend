import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { Login } from './auth/login';

export default [
    { path: 'empty', component: Empty },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
