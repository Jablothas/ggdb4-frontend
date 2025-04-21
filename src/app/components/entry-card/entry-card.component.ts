import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { GameRecord } from '../../models/record.model';
import { DatePipe, NgClass, NgIf, NgStyle } from '@angular/common';
import { RecordType } from '../../enum/type.enum';
import { Router } from '@angular/router';
import { StatService } from '../../service/stat.service';

@Component({
    selector: 'app-entry-card',
    imports: [CardModule, NgIf, DatePipe, NgStyle, NgClass],
    providers: [StatService],
    templateUrl: './entry-card.component.html',
    styleUrl: './entry-card.component.scss'
})
export class EntryCardComponent {
    @Input() gameRecord: GameRecord | undefined;
    router: Router = inject(Router)
    statService: StatService = inject(StatService);
    score: number = 0;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['gameRecord'] && this.gameRecord) {
            this.score = this.statService.getTotalScore(this.gameRecord);
        }
    }

    getRecordTypeLabel(type: keyof typeof RecordType | undefined): string {
        return type && type !== 'FULL' ? RecordType[type] : '';
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
}
