import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data.service';
import { GameRecord } from '../../models/record.model'

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `<p>Dashboard loaded – check console output.</p>`
})
export class Dashboard implements OnInit {

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.dataService.getAllRecords('jablo').subscribe((records: GameRecord[]) => {
            console.log('Records:', records);
        });
    }
}

