import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { Record } from '../../models/record.model';


@Injectable({
    providedIn: 'root'
})
export class DataService {
    private apiUrl = 'https://api.playthrough.info/request';
    private records: Record[] = [];
    private sessionId: string | null = null;

    constructor(private http: HttpClient) {}

    login(user: User): Observable<any> {
        const url = `${this.apiUrl}?action=login`;

        const requestBody = {
            username: user.username.toLowerCase(),
            pwd: user.pwd
        };

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        console.log('Sending login request with body:', requestBody);

        return this.http.post<any>(url, JSON.stringify(requestBody), {
            headers,
            withCredentials: true
        }).pipe(
            tap(response => {
                this.sessionId = response.sessionId;
                console.log('Login response:', response);
            }),
            catchError(error => {
                console.error('Login failed:', error);
                return of({ success: false });
            })
        );
    }

    getAllRecords(username: string): Observable<Record[]> {
        const url = `${this.apiUrl}?action=read&username=${username.toLowerCase()}`;

        return this.http.get<Record[]>(url, {
            withCredentials: true
        }).pipe(
            tap(records => {
                this.records = records;
                console.log('Records fetched:', records.length, records);
            }),
            catchError(error => {
                console.error('Failed to load records:', error);
                return of([]);
            })
        );
    }

    getRecords(): Record[] {
        return this.records;
    }
}

