import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/data.service';
import { GameRecord } from '../../models/record.model'
import { GameCompletionChartComponent } from '../../components/game-completion-chart/game-completion-chart.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, GameCompletionChartComponent],
    templateUrl: 'dashboard.html'
})
export class Dashboard implements OnInit {
    username: string = '';
    records: GameRecord[] = [];
    bestGame: { name: string, score: number } | null = null;

    constructor(private dataService: DataService) {}

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
            const totalScore = this.calculateTotalScore(record);

            if (totalScore > maxScore) {
                maxScore = totalScore;
                bestGames = [record];
            } else if (totalScore === maxScore) {
                bestGames.push(record);
            }
        }
        bestGames.sort((a, b) => new Date(b.finishDate).getTime() - new Date(a.finishDate).getTime());
        const bestGame = bestGames[0];
        return { name: bestGame?.name || '', score: this.calculateTotalScore(bestGame) };
    }

    private calculateTotalScore(record: GameRecord): number {
        return record.scoreGameplay + record.scorePresentation + record.scoreNarrative + record.scoreQuality + record.scoreSound + record.scoreContent + record.scorePacing + record.scoreBalance + record.scoreUIUX + record.scoreImpression;
    }
}

