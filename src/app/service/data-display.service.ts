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
            // Steam
            case 'STEAM': return 'Steam';

            // PlayStation family
            case 'PLAYSTATION_1': return 'PlayStation 1';
            case 'PLAYSTATION_2': return 'PlayStation 2';
            case 'PLAYSTATION_3': return 'PlayStation 3';
            case 'PLAYSTATION_4': return 'PlayStation 4';
            case 'PLAYSTATION': return 'PlayStation 5';
            case 'PS_VITA': return 'PlayStation Vita';
            case 'PSP': return 'PlayStation Portable';

            // Xbox family
            case 'XBOX': return 'Xbox Series X/S';
            case 'XBOX_ONE': return 'Xbox One';
            case 'XBOX_360': return 'Xbox 360';
            case 'XBOX_ORIGINAL': return 'Original Xbox';
            case 'XBOX_GAME_PASS': return 'Xbox Game Pass';

            // Nintendo family
            case 'NINTENDO_CONSOLE': return 'Nintendo Switch';
            case 'WII': return 'Nintendo Wii';
            case 'WII_U': return 'Nintendo Wii U';
            case 'NINTENDO_3DS': return 'Nintendo 3DS';
            case 'NINTENDO_DS': return 'Nintendo DS';
            case 'GBA': return 'Game Boy Advance';
            case 'GAME_BOY': return 'Game Boy';
            case 'NES': return 'Nintendo Entertainment System';
            case 'SNES': return 'Super Nintendo Entertainment System';
            case 'N64': return 'Nintendo 64';
            case 'GAMECUBE': return 'Nintendo GameCube';

            // PC Launchers
            case 'EPIC_GAMES': return 'Epic Games';
            case 'EA_PLAY': return 'EA Play';
            case 'UPLAY': return 'UPlay';
            case 'GOG': return 'GOG';

            // Retro consoles
            case 'GENESIS': return 'Sega Genesis / Mega Drive';
            case 'SATURN': return 'Sega Saturn';
            case 'DREAMCAST': return 'Sega Dreamcast';
            case 'ATARI_2600': return 'Atari 2600';

            // Other or fallback
            case 'OTHER': return 'Other';

            default: return location || '—';
        }
    }

    getPlatformIconClass(location: string): string {
        switch (location) {
            // 🎮 Platform groups
            case 'STEAM': return 'bi bi-steam';

            case 'PLAYSTATION':
            case 'PLAYSTATION_1':
            case 'PLAYSTATION_2':
            case 'PLAYSTATION_3':
            case 'PLAYSTATION_4':
            case 'PS_VITA':
            case 'PSP': return 'bi bi-playstation';

            case 'XBOX':
            case 'XBOX_ONE':
            case 'XBOX_360':
            case 'XBOX_ORIGINAL':
            case 'XBOX_GAME_PASS': return 'bi bi-xbox';

            case 'NINTENDO_CONSOLE': return 'bi bi-nintendo-switch';

            // 💻 PC platforms
            case 'EPIC_GAMES':
            case 'EA_PLAY':
            case 'UPLAY':
            case 'GOG': return 'bi bi-pc-display'; // generic for launchers

            // 🕹️ Retro consoles and others
            case 'GENESIS':
            case 'SATURN':
            case 'DREAMCAST':
            case 'ATARI_2600': return 'bi bi-controller'; // retro consoles

            case 'OTHER': return 'bi bi-question-circle';
            default: return 'bi bi-disc'; // fallback/default
        }
    }
}
