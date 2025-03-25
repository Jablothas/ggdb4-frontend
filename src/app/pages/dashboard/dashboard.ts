import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../service/data.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    template: `
    `
})
export class Dashboard implements OnInit {

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        const user: User = {
            username: 'Jablo',
            pwd: 'FUSsbs4M&LmD78'
        };

        this.dataService.login(user).subscribe(loginRes => {
            console.log('Login response:', loginRes);

            if (loginRes?.success) {
                this.dataService.getAllRecords(user.username).subscribe(records => {
                    console.log('Records:', records);
                });
            } else {
                console.error('Login failed');
            }
        });
    }
}
