import { Injectable } from '@angular/core';
import { GameRecord } from '../models/record.model';

@Injectable({
    providedIn: 'root'
})
export class DataDisplayService {
    getTotalScore(record?: GameRecord): number {
        if (!record) return 0;

        const scores = [
            'scoreGameplay', 'scorePresentation', 'scoreNarrative', 'scoreQuality',
            'scoreSound', 'scoreContent', 'scorePacing', 'scoreBalance',
            'scoreUIUX', 'scoreImpression'
        ] as const;

        let reachedPoints = 0;
        let countedCategories = 0;

        for (const key of scores) {
            const value = record[key] ?? 0;
            if (value > 0) {
                reachedPoints += value;
                countedCategories++;
            }
        }

        if (countedCategories === 0) return 0;
        return Math.round((reachedPoints / (countedCategories * 10)) * 100);
    }

    isTierScore(score: number): boolean {
        return score >= 85;
    }

    getTierGradient(score: number): string {
        if (score >= 95) return 'radial-gradient(circle, #FFD700 40%, #ffb6c1 100%)'; // gold
        if (score >= 90) return 'radial-gradient(circle, #C0C0C0 40%, #90ee90 100%)'; // silver
        if (score >= 85) return 'radial-gradient(circle, #e49a6e 30%, #b4693e 90%)';   // bronze
        return 'transparent';
    }

    getScoreTextColor(score: number): string {
        if (score >= 80) return 'limegreen';
        if (score >= 75) return 'yellowgreen';
        if (score >= 70) return 'yellow';
        if (score >= 65) return 'orange';
        return 'red';
    }

    getPlatformLabel(location: string): string {
        switch (location) {
            case 'STEAM': return 'Steam';
            case 'PLAYSTATION': return 'PlayStation';
            case 'XBOX': return 'Xbox';
            case 'XBOX_GAME_PASS': return 'Xbox Game Pass';
            case 'NINTENDO_CONSOLE': return 'Nintendo Switch';
            default: return location || '—';
        }
    }

    getPlatformIconClass(location: string): string {
        switch (location) {
            case 'STEAM': return 'bi bi-steam';
            case 'PLAYSTATION': return 'bi bi-playstation';
            case 'XBOX':
            case 'XBOX_GAME_PASS': return 'bi bi-xbox';
            case 'NINTENDO_CONSOLE': return 'bi bi-nintendo-switch';
            default: return 'bi bi-disc';
        }
    }
}
