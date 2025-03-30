import { Component, Input, OnChanges } from '@angular/core';
import { GameRecord } from '../../models/record.model';
import { UIChart } from 'primeng/chart';

@Component({
    selector: 'app-game-completion-chart',
    imports: [UIChart],
    templateUrl: './game-completion-chart.component.html',
    styleUrl: './game-completion-chart.component.scss'
})
export class GameCompletionChartComponent implements OnChanges {
    @Input() records: GameRecord[] = [];

    chartData: any;
    chartOptions: any;

    ngOnChanges() {
        this.initChart();
    }

    private initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        const recordsPerYear = this.getRecordsPerYear();

        this.chartData = {
            labels: Object.keys(recordsPerYear),
            datasets: [
                {
                    label: 'Games Finished',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                    data: Object.values(recordsPerYear),
                    barThickness: 32
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    }

    private getRecordsPerYear(): { [year: string]: number } {
        const yearCounts: { [year: string]: number } = {};
        let minYear = Number.POSITIVE_INFINITY;
        let maxYear = Number.NEGATIVE_INFINITY;

        for (const record of this.records) {
            const year = new Date(record.finishDate).getFullYear();
            yearCounts[year] = (yearCounts[year] || 0) + 1;

            if (year < minYear) minYear = year;
            if (year > maxYear) maxYear = year;
        }
        const completeYearCounts: { [year: string]: number } = {};
        for (let year = minYear; year <= maxYear; year++) {
            completeYearCounts[year.toString()] = yearCounts[year] || 0;
        }

        return completeYearCounts;
    }
}
