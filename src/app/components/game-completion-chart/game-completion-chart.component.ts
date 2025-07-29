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
                    barThickness: 90
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
                    },
                    categoryPercentage: 0.9,
                    barPercentage: 0.8
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

        for (const record of this.records) {
            const year = new Date(record.finishDate).getFullYear();
            yearCounts[year] = (yearCounts[year] || 0) + 1;
        }

        // Only return years that have at least 1 record
        const filteredYearCounts: { [year: string]: number } = {};
        Object.keys(yearCounts)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach(year => {
                if (yearCounts[year] > 0) {
                    filteredYearCounts[year] = yearCounts[year];
                }
            });

        return filteredYearCounts;
    }
}
