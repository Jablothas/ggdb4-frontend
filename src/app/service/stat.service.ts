import { DataService } from './data.service';
import { inject } from '@angular/core';
import { GameRecord } from '../models/record.model';

export class StatService {
    dataService = inject(DataService);
    records: GameRecord[] = [];
    username: string = "";

    constructor() {
        this.username = this.dataService.getUsername();
        this.dataService.getAllRecords(this.username).subscribe((records: GameRecord[]) => {
            this.records = records;
        });
    }

}
