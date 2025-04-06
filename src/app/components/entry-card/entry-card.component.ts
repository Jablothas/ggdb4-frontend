import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { GameRecord } from '../../models/record.model';
import { DatePipe, NgClass, NgIf, NgStyle, NgSwitch, NgSwitchDefault } from '@angular/common';
import { RecordType } from '../../enum/type.enum';
import { Router } from '@angular/router';

@Component({
    selector: 'app-entry-card',
    imports: [CardModule, NgIf, DatePipe, NgStyle, NgSwitch, NgSwitchDefault, NgClass],
    templateUrl: './entry-card.component.html',
    styleUrl: './entry-card.component.scss'
})
export class EntryCardComponent {
    @Input() gameRecord: GameRecord | undefined;

    constructor(private router: Router) {}

    getRecordTypeLabel(type: keyof typeof RecordType | undefined): string {
        return type && type !== 'FULL' ? RecordType[type] : '';
    }

    getTotalScore(): number {
        if (!this.gameRecord) return 0;

        const scores = ['scoreGameplay', 'scorePresentation', 'scoreNarrative', 'scoreQuality', 'scoreSound', 'scoreContent', 'scorePacing', 'scoreBalance', 'scoreUIUX', 'scoreImpression'] as const;

        return scores.reduce((sum, key) => {
            const value = this.gameRecord![key] ?? 0;
            return sum + (value === 0 ? 10 : value);
        }, 0);
    }

    isTierScore(score: number): boolean {
        return score >= 85;
    }

    getTierGradient(score: number): string {
        if (score >= 95) {
            return 'radial-gradient(circle, #FFD700 40%, #ffb6c1 100%)';
        } else if (score >= 90) {
            return 'radial-gradient(circle, #C0C0C0 40%, #90ee90 100%)';
        } else if (score >= 85) {
            return 'radial-gradient(circle, #e49a6e 30%, #b4693e 90%)';
        }
        return 'transparent';
    }

    getScoreTextColor(score: number): string {
        if (score >= 80) return 'limegreen';
        if (score >= 75) return 'yellowgreen';
        if (score >= 70) return 'yellow';
        if (score >= 65) return 'orange';
        return 'red';
    }

    goToDetail(): void {
        if (this.gameRecord) {
            this.router.navigate(['/detail'], {
                queryParams: { record: this.gameRecord.id }
            });
        }
    }

    formatDate(): string {
        const date = this.gameRecord?.finishDate;
        return '';
    }
}
