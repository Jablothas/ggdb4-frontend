import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { GameRecord } from '../../models/record.model';
import { NgIf} from '@angular/common';
import { RecordType } from '../../enum/type.enum';

@Component({
    selector: 'app-entry',
    imports: [CardModule, NgIf],
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
        return (
            this.gameRecord.scoreGameplay +
            this.gameRecord.scorePresentation +
            this.gameRecord.scoreNarrative +
            this.gameRecord.scoreQuality +
            this.gameRecord.scoreSound +
            this.gameRecord.scoreContent +
            this.gameRecord.scorePacing +
            this.gameRecord.scoreBalance +
            this.gameRecord.scoreUIUX +
            this.gameRecord.scoreImpression
        );
    }

    getTriangleColor(score: number): string {
        if (score >= 95) {
            return '#FFD700'; // Legendary
        } else if (score >= 90) {
            return '#9b59b6'; // Epic
        } else if (score >= 85) {
            return '#1e90ff'; // Rare
        }
        return 'transparent'; // No triangle
    }

    getScoreColor(score: number): string {
        if (score >= 95) {
            return '#FFD700'; // Legendary
        } else if (score >= 90) {
            return '#9b59b6'; // Epic
        } else if (score >= 85) {
            return '#1e90ff'; // Rare
        }
        return '#ffffff'; // Common
    }
}
