import { Injectable, inject } from "@angular/core";
import { GameRecord } from "../models/record.model";
import { VersionService } from "./version.service";

@Injectable({
    providedIn: 'root'
})
export class ClipboardService {
    private versionService = inject(VersionService);

    async generateAndCopyCardToClipboard(record: GameRecord, totalScore: number): Promise<void> {
        try {
            if (!navigator.clipboard || !ClipboardItem) {
                throw new Error('Clipboard API not supported');
            }

            const canvas = this.createCard(record, totalScore);
            const blob = await this.canvasToBlob(canvas);

            if (!blob || blob.size === 0) {
                throw new Error('Failed to generate card image');
            }

            const clipboardItem = new ClipboardItem({
                'image/png': blob
            });

            await navigator.clipboard.write([clipboardItem]);
        } catch (error) {
            console.error('Failed to copy card to clipboard:', error);
            this.downloadCard(record, totalScore);
            throw new Error('Clipboard not supported. Image will be downloaded instead.');
        }
    }

    private downloadCard(record: GameRecord, totalScore: number): void {
        const canvas = this.createCard(record, totalScore);
        const link = document.createElement('a');

        const safeName = (record.name || 'game-card')
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase()
            .substring(0, 50);

        link.download = `${safeName}_stats_${totalScore}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    private createCard(record: GameRecord, totalScore: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        const width = 450;
        const height = 320;

        const devicePixelRatio = window.devicePixelRatio || 1;

        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.scale(devicePixelRatio, devicePixelRatio);

        const primaryColor = this.getPrimaryColor();
        const surfaceColors = this.getSurfaceColors();

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, surfaceColors.dark);
        gradient.addColorStop(1, surfaceColors.darker);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = primaryColor;
        ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        const title = record.name || 'Unknown Game';

        const maxTitleWidth = 380;
        let displayTitle = title;
        const titleMetrics = ctx.measureText(title);
        if (titleMetrics.width > maxTitleWidth) {
            while (ctx.measureText(displayTitle + '...').width > maxTitleWidth && displayTitle.length > 0) {
                displayTitle = displayTitle.slice(0, -1);
            }
            displayTitle += '...';
        }

        ctx.fillText(displayTitle, 20, 35);

        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';

        let scoreColor: string;
        if (totalScore >= 95) {
            scoreColor = '#FFD700';
        } else if (totalScore >= 90) {
            scoreColor = '#C0C0C0';
        } else if (totalScore >= 85) {
            scoreColor = '#e49a6e';
        } else {
            scoreColor = '#ffffff';
        }

        ctx.fillStyle = scoreColor;
        ctx.textAlign = 'left';

        ctx.fillText(totalScore.toString(), 20, 85);

        ctx.font = '14px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#d1d5db';
        ctx.textAlign = 'left';

        const allScoreFields = [
            { key: 'scoreGameplay', label: 'Gameplay' },
            { key: 'scorePresentation', label: 'Presentation' },
            { key: 'scoreNarrative', label: 'Narrative' },
            { key: 'scoreQuality', label: 'Quality' },
            { key: 'scoreSound', label: 'Sound' },
            { key: 'scoreContent', label: 'Content' },
            { key: 'scorePacing', label: 'Pacing' },
            { key: 'scoreBalance', label: 'Balance' },
            { key: 'scoreUIUX', label: 'UI/UX' },
            { key: 'scoreImpression', label: 'Impression' }
        ];

        const rightAreaStartX = 180;
        const col1X = rightAreaStartX;
        const col2X = rightAreaStartX + 130;
        let startY = 60;
        const rowHeight = 20;

        allScoreFields.forEach((field, index) => {
            const score = record[field.key as keyof GameRecord] as number || 0;

            const x = index % 2 === 0 ? col1X : col2X;
            const currentY = startY + Math.floor(index / 2) * rowHeight;

            ctx.fillStyle = '#9ca3af';
            ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
            ctx.fillText(`${field.label}:`, x, currentY);

            if (score === 0) {
                ctx.fillStyle = '#6b7280';
                ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
                ctx.fillText('-', x + 80, currentY);
            } else {
                let scoreColor: string;
                if (score >= 8) {
                    scoreColor = '#32cd32';
                } else if (score >= 6) {
                    scoreColor = '#ffa500';
                } else if (score >= 4) {
                    scoreColor = '#ff4444';
                } else {
                    scoreColor = '#6b7280';
                }

                ctx.fillStyle = scoreColor;
                ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
                ctx.fillText(score.toString(), x + 80, currentY);
            }
        });

        const replayValueLabels = ['No replay value', 'Maybe someday', 'Would replay', 'Definitely again', "Can't stop playing!"];
        const replayValue = record.replayValue || 1;
        const replayLabel = replayValueLabels[replayValue - 1] || 'Unknown';

        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'left';
        ctx.fillText('Replay Value:', 20, height - 120);

        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(replayLabel, 20, height - 105);

        const progressBarX = 20;
        const progressBarY = height - 95;
        const progressBarWidth = 120;
        const progressBarHeight = 6;

        ctx.fillStyle = '#374151';
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

        const fillWidth = (progressBarWidth * replayValue) / 5;
        let progressColor = primaryColor;
        if (replayValue <= 2) progressColor = '#ef4444';
        else if (replayValue <= 3) progressColor = '#f59e0b';

        ctx.fillStyle = progressColor;
        ctx.fillRect(progressBarX, progressBarY, fillWidth, progressBarHeight);

        let checkmarkY = height - 120;

        if (record.mainQuestDone === 1) {
            ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = primaryColor;
            ctx.textAlign = 'left';
            ctx.fillText('✓ Main Quest Done', 180, checkmarkY);
        }

        if (record.replay === 1) {
            const replayY = record.mainQuestDone === 1 ? checkmarkY + 15 : checkmarkY;
            ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = primaryColor;
            ctx.textAlign = 'left';
            ctx.fillText('✓ Replayed', 180, replayY);
        }

        if (record.finishDate) {
            const finishDate = new Date(record.finishDate);
            const dateString = finishDate.toLocaleDateString('de-DE');

            ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#6b7280';
            ctx.textAlign = 'left';
            ctx.fillText(`finished on ${dateString}`, 20, height - 15);
        }

        const version = this.versionService.getVersion();
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#4b5563';
        ctx.textAlign = 'right';
        ctx.fillText(`GG.DB ${version}`, width - 20, height - 15);

        return canvas;
    }

    private getPrimaryColor(): string {
        const savedPrimary = localStorage.getItem('primaryColor') || 'emerald';

        const primaryPalettes: { [key: string]: string } = {
            'emerald': '#10b981',
            'green': '#22c55e',
            'lime': '#84cc16',
            'orange': '#f97316',
            'amber': '#f59e0b',
            'yellow': '#eab308',
            'teal': '#14b8a6',
            'cyan': '#06b6d4',
            'sky': '#0ea5e9',
            'blue': '#3b82f6',
            'indigo': '#6366f1',
            'violet': '#8b5cf6',
            'purple': '#a855f7',
            'fuchsia': '#d946ef',
            'pink': '#ec4899',
            'rose': '#f43f5e',
            'noir': '#6b7280'
        };

        return primaryPalettes[savedPrimary] || '#10b981';
    }

    private getSurfaceColors(): { dark: string; darker: string } {
        const savedSurface = localStorage.getItem('surfaceColor') || 'slate';

        const surfacePalettes: { [key: string]: { dark: string; darker: string } } = {
            'slate': { dark: '#1e293b', darker: '#0f172a' },
            'gray': { dark: '#1f2937', darker: '#111827' },
            'zinc': { dark: '#27272a', darker: '#18181b' },
            'neutral': { dark: '#262626', darker: '#171717' },
            'stone': { dark: '#292524', darker: '#1c1917' }
        };

        return surfacePalettes[savedSurface] || { dark: '#1e293b', darker: '#0f172a' };
    }

    private canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create blob from canvas'));
                }
        }, 'image/png');
    });
    }

    private drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor: string | null = null, strokeOnly: boolean = false): void {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        if (!strokeOnly && fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }

        if (strokeOnly) {
            ctx.stroke();
        }
    }
}
