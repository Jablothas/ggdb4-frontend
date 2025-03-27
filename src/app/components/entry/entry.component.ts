import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { GameRecord } from '../../models/record.model';
import { DatePipe, NgIf } from '@angular/common';
import { RecordType } from '../../enum/type.enum';

@Component({
    selector: 'app-entry',
    imports: [CardModule, NgIf, DatePipe],
    templateUrl: './entry.component.html',
    styleUrl: './entry.component.scss'
})
export class EntryComponent {
    @Input() gameRecord: GameRecord | undefined;

    getRecordTypeLabel(type: keyof typeof RecordType | undefined): string {
        return type && type !== 'FULL' ? RecordType[type] : '';
    }

    getTotalScore(): number {
        if (!this.gameRecord) return 0;

        const scores = ['scoreGameplay', 'scorePresentation', 'scoreNarrative', 'scoreQuality', 'scoreSound',
            'scoreContent', 'scorePacing', 'scoreBalance', 'scoreUIUX', 'scoreImpression'] as const;

        return scores.reduce((sum, key) => {
            const value = this.gameRecord![key] ?? 0;
            return sum + (value === 0 ? 10 : value);
        }, 0);
    }

    getGradientBackground(score: number): string {
        const tierColor = this.getTierColor(score);
        if (!tierColor) {
            return '#101112';
        }
        return `linear-gradient(-135deg, ${tierColor} 55px, #0f1114 0)`;
    }

    getTierColor(score: number): string | null {
        if (score >= 95) {
            return '#FFD700'; // Gold
        } else if (score >= 90) {
            return '#C0C0C0'; // Silver
        } else if (score >= 85) {
            return '#cd7f32'; // Bronze
        }
        return 'var(--surface-card)';
    }

    getScoreTextColor(score: number): string {
        if (score >= 95) return '#000';
        if (score >= 90) return '#000';
        if (score >= 85) return '#000';
        return 'var(--text-color)';
    }

    formatDate(): string {
        const date = this.gameRecord?.finishDate;
        return '';
    }
}
