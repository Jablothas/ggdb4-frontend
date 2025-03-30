import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { User } from '../models/user.model';
import { GameRecord } from '../models/record.model';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private apiUrl = 'https://api.ggdb.app/request';
    private records: GameRecord[] = [];
    private sessionId: string | null = null;
    private username: string | null = null;

    constructor(
        private http: HttpClient,
        public loginService: LoginService,
        private toast: ToastService,
        private router: Router
    ) {}

    login(user: User): Observable<any> {
        const url = `${this.apiUrl}?action=login`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        const requestBody = {
            username: user.username.toLowerCase(),
            pwd: user.pwd
        };

        return this.http.post<any>(url, JSON.stringify(requestBody), {
            headers,
            withCredentials: true
        }).pipe(
            tap(response => {
                this.sessionId = response.sessionId;
                const success = !!response.sessionId;
                this.loginService.setLoggedIn(success);

                if (success) {
                    const username = requestBody.username;
                    this.loginService.setUsername(username);

                    // Delay toast after route navigation
                    setTimeout(() => {
                        // Temporary disabled toast here
                    }, 200);
                    this.username = username;
                    this.router.navigate(['/']);
                } else {
                    this.toast.error('Login failed', 'Invalid credentials.');
                }
            }),
            catchError(error => {
                this.loginService.setLoggedIn(false);
                this.loginService.setUsername(null);
                this.toast.error('Login failed', 'An error occurred during login.');
                return of({ success: false });
            })
        );
    }

    getUsername(): string {
        return this.username ?? '';
    }

    getAllRecords(username: string): Observable<GameRecord[]> {
        const url = `${this.apiUrl}?action=read&username=${username.toLowerCase()}`;

        return this.http.get<GameRecord[]>(url, {
            withCredentials: true
        }).pipe(
            tap(records => {
                this.records = records;
            }),
            catchError(error => {
                return of([]);
            })
        );
    }

    getRecords(): GameRecord[] {
        return this.records;
    }

    createRecord(username: string, recordData: any): Observable<any> {
        const url = `${this.apiUrl}?action=create&username=${username.toLowerCase()}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, JSON.stringify(recordData), {
            headers,
            withCredentials: true
        }).pipe(
            tap(() => {
                // No toast here — handled by Overview via queryParams
            }),
            catchError(error => {
                this.toast.error('Create failed', 'Something went wrong while saving.');
                return of({ success: false });
            })
        );
    }

    updateRecord(username: string, recordData: any): Observable<any> {
        const url = `${this.apiUrl}?action=update&username=${username.toLowerCase()}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, JSON.stringify(recordData), {
            headers,
            withCredentials: true
        }).pipe(
            tap(() => {
                // No toast here — handled by Overview via queryParams
            }),
            catchError(error => {
                this.toast.error('Update failed', 'Something went wrong while updating.');
                return of({ success: false });
            })
        );
    }

    deleteRecord(username: string, recordId: number): Observable<any> {
        const url = `${this.apiUrl}?action=delete&username=${username.toLowerCase()}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        const body = { id: String(recordId) };

        return this.http.post<any>(url, JSON.stringify(body), {
            headers,
            withCredentials: true
        }).pipe(
            tap(() => {
                // No toast here — handled by Overview via queryParams
            }),
            catchError(error => {
                this.toast.error('Delete failed', 'Something went wrong while deleting.');
                return of({ success: false });
            })
        );
    }

    logout(username: string): Observable<any> {
        const url = `${this.apiUrl}?action=logout&username=${username.toLowerCase()}`;
        return this.http.get<any>(url, { withCredentials: true }).pipe(
            tap(() => {
                this.records = [];
                this.sessionId = null;
                this.loginService.setLoggedIn(false);
                this.loginService.setUsername(null);
            }),
            catchError(error => {
                return of({ success: false });
            })
        );
    }
}
