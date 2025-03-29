import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { GameRecord } from '../../models/record.model';
import { CardModule } from 'primeng/card';
import { EntryComponent } from '../../components/entry/entry.component';
import { YearlyLineBreakComponent } from '../../components/yearly-line-break/yearly-line-break.component';
import { CommonModule } from '@angular/common';

interface GameRecordGroup {
    year: number | null;
    yearCount: number | null;
    gameRecord: GameRecord;
}

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [CommonModule, CardModule, EntryComponent, YearlyLineBreakComponent],
    templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
    private readonly dataService = inject(DataService);
    groupedGameRecords: GameRecordGroup[] = [];

    ngOnInit(): void {
        const username = this.dataService.loginService.getUsername();
        if (!username) return;
        this.dataService.getAllRecords(username).subscribe(records => {
            records.sort((a, b) => new Date(b.finishDate).getTime() - new Date(a.finishDate).getTime());
            this.groupedGameRecords = this.groupRecordsByYear(records);
        });
    }

    private groupRecordsByYear(records: GameRecord[]): GameRecordGroup[] {
        const result: GameRecordGroup[] = [];
        let lastYear: number | null = null;

        // Count how many entries exist per year
        const counts = records.reduce((map, record) => {
            const year = new Date(record.finishDate).getFullYear();
            map[year] = (map[year] || 0) + 1;
            return map;
        }, {} as Record<number, number>);

        for (const record of records) {
            const year = new Date(record.finishDate).getFullYear();
            const insertSplitter = year !== lastYear;

            result.push({
                year: insertSplitter ? year : null,
                gameRecord: record,
                yearCount: insertSplitter ? counts[year] : null
            });

            lastYear = year;
        }

        return result;
    }
}
