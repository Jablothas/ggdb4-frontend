import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data.service';
import { GameRecord } from '../../models/record.model'
import { GameCompletionChartComponent } from '../../components/game-completion-chart/game-completion-chart.component';
import { StatService } from '../../service/stat.service';
import { VersionService } from '../../service/version.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    providers: [StatService],
    imports: [CommonModule, GameCompletionChartComponent],
    templateUrl: 'dashboard.html'
})
export class Dashboard implements OnInit {
    statService: StatService = inject(StatService);
    username: string = '';
    records: GameRecord[] = [];
    bestGame: { name: string, score: number } | null = null;
    version: string;

    constructor(
        private dataService: DataService,
        private versionService: VersionService
    ) {
        this.version = this.versionService.getVersion();
    }

    ngOnInit(): void {
        this.username = this.dataService.getUsername();
        this.dataService.getAllRecords(this.username).subscribe((records: GameRecord[]) => {
            this.records = records;
            this.bestGame = this.getHighestRatedGame();
        });
    }

    getCurrentYear(): number {
        return new Date().getFullYear();
    }

    getPreviousYear(): number {
        return new Date().getFullYear() - 1;
    }

    countAllRecords(): number {
        return this.records.length;
    }

    countRecordsPerYear(year: number): number {
        let count = 0;
        this.records.map((record: GameRecord) => {
            if (new Date(record.finishDate).getFullYear() === year) {
                count++;
            }
        });
        return count;
    }

    getHighestRatedGame(): { name: string, score: number } | null {
        if (!this.records.length) return null;

        let maxScore = -1;
        let bestGames: GameRecord[] = [];

        for (const record of this.records) {
            const totalScore = this.statService.getTotalScore(record);

            if (totalScore > maxScore) {
                maxScore = totalScore;
                bestGames = [record];
            } else if (totalScore === maxScore) {
                bestGames.push(record);
            }
        }

        bestGames.sort((a, b) => new Date(b.finishDate).getTime() - new Date(a.finishDate).getTime());
        const bestGame = bestGames[0];
        return { name: bestGame?.name || '', score: this.statService.getTotalScore(bestGame) };
    }

    getAverageRatingForYear(year: number): number {
        const yearRecords = this.records.filter(record =>
            new Date(record.finishDate).getFullYear() === year
        );

        if (yearRecords.length === 0) return 0;

        const totalScore = yearRecords.reduce((sum, record) =>
            sum + this.statService.getTotalScore(record), 0
        );

        return Math.round(totalScore / yearRecords.length);
    }

    getCurrentYearAverageRating(): number {
        return this.getAverageRatingForYear(this.getCurrentYear());
    }

    getLastYearAverageRating(): number {
        return this.getAverageRatingForYear(this.getPreviousYear());
    }

    getYearWithHighestAverage(): { year: number, average: number } {
        if (!this.records.length) return { year: 0, average: 0 };

        const yearAverages = new Map<number, { total: number, count: number }>();

        // Calculate totals and counts for each year
        this.records.forEach(record => {
            const year = new Date(record.finishDate).getFullYear();
            const score = this.statService.getTotalScore(record);

            if (!yearAverages.has(year)) {
                yearAverages.set(year, { total: 0, count: 0 });
            }

            const yearData = yearAverages.get(year)!;
            yearData.total += score;
            yearData.count += 1;
        });

        let bestYear = 0;
        let bestAverage = 0;

        yearAverages.forEach((data, year) => {
            const average = Math.round(data.total / data.count);
            if (average > bestAverage) {
                bestAverage = average;
                bestYear = year;
            }
        });

        return { year: bestYear, average: bestAverage };
    }
}

