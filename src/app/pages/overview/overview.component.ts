import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { GameRecord } from '../../models/record.model';
import { CardModule } from 'primeng/card';
import { EntryCardComponent } from '../../components/entry-card/entry-card.component';
import { YearlyLineBreakComponent } from '../../components/yearly-line-break/yearly-line-break.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../service/toast.service';

interface GameRecordGroup {
    year: number | null;
    yearCount: number | null;
    gameRecord: GameRecord;
}

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [CommonModule, CardModule, EntryCardComponent, YearlyLineBreakComponent],
    templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
    private readonly dataService = inject(DataService);
    private readonly route = inject(ActivatedRoute);
    private readonly toast = inject(ToastService);
    private readonly router = inject(Router);

    groupedGameRecords: GameRecordGroup[] = [];

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const toastType = params['toast'];
            const gameName = params['game'];

            if (toastType && gameName) {
                let message = '';
                let summary = '';

                if (toastType === 'created') {
                    summary = 'Saved!';
                    message = `${gameName} successfully finished!`;
                } else if (toastType === 'updated') {
                    summary = 'Updated!';
                    message = `${gameName} successfully updated.`;
                } else if (toastType === 'deleted') {
                    summary = 'Deleted!';
                    message = `${gameName} has been deleted.`;
                }

                if (message) {
                    setTimeout(() => {
                        this.toast.success(summary, message);
                    }, 0);

                    this.router.navigate([], {
                        queryParams: {
                            toast: null,
                            game: null
                        },
                        queryParamsHandling: 'merge'
                    });
                }
            }
        });

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
        const counts = records.reduce(
            (map, record) => {
                const year = new Date(record.finishDate).getFullYear();
                map[year] = (map[year] || 0) + 1;
                return map;
            },
            {} as Record<number, number>
        );

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
