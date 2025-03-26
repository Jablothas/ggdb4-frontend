import { Component, inject } from '@angular/core';
import { DataService } from '../../service/data.service';
import { GameRecord } from '../../models/record.model';
import { CardModule } from 'primeng/card';
import { EntryComponent } from '../../components/entry/entry.component';

@Component({
    selector: 'app-overview',
    imports: [CardModule, EntryComponent],
    templateUrl: './overview.component.html'
})
export class OverviewComponent {
    private readonly dataService = inject(DataService);
    gameRecords: GameRecord[] = [];

    constructor() {
        this.dataService.getRecords().map((gameRecord) => {
            this.gameRecords.push(gameRecord as GameRecord);
        });
    }
}
