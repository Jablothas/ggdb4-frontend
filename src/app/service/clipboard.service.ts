import { Injectable } from "@angular/core";
import { GameRecord } from "../models/record.model";

@Injectable({
    providedIn: 'root'
})
export class ClipboardService {
    
    async generateAndCopyCardToClipboard(record: GameRecord, totalScore: number): Promise<void> {
        try {
            // Check if Clipboard API is supported
            if (!navigator.clipboard || !ClipboardItem) {
                throw new Error('Clipboard API not supported');
            }

            const canvas = this.createCard(record, totalScore);
            const blob = await this.canvasToBlob(canvas);
            
            const clipboardItem = new ClipboardItem({
                'image/png': blob
            });
            
            await navigator.clipboard.write([clipboardItem]);
        } catch (error) {
            console.error('Failed to copy card to clipboard:', error);
            // Fallback: download the image instead
            this.downloadCard(record, totalScore);
            throw new Error('Clipboard not supported. Image will be downloaded instead.');
        }
    }

    private downloadCard(record: GameRecord, totalScore: number): void {
        const canvas = this.createCard(record, totalScore);
        const link = document.createElement('a');
        link.download = `${record.name || 'game-card'}-stats.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    private createCard(record: GameRecord, totalScore: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Card dimensions
        const width = 500;
        const height = 280;
        canvas.width = width;
        canvas.height = height;
        
        // Background
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, width, height);
        
        // Border
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);
        
        // Game title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        const title = record.name || 'Unknown Game';
        ctx.fillText(title, 20, 40);
        
        // Total score - positioned on the left side under title
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#00ff88';
        ctx.textAlign = 'left';
        ctx.fillText(totalScore.toString(), 20, 100);
        
        // Score details - positioned on the right side
        ctx.font = '16px Arial';
        ctx.fillStyle = '#cccccc';
        ctx.textAlign = 'left';
        
        // Select key scores to display (similar to your example)
        const keyScoreFields = [
            { key: 'scoreGameplay', label: 'gameplay' },
            { key: 'scoreSound', label: 'sound' },
            { key: 'scorePresentation', label: 'presentation' },
            { key: 'scoreQuality', label: 'quality' },
            { key: 'scoreNarrative', label: 'narrative' },
            { key: 'scoreContent', label: 'content' }
        ];
        
        // Filter out disabled scores (0 values) and get only enabled ones
        const enabledScores = keyScoreFields.filter(field => {
            const score = record[field.key as keyof GameRecord] as number || 0;
            return score > 0;
        });
        
        // Position scores on the right side in two columns
        const rightAreaStartX = 200;
        const col1X = rightAreaStartX;
        const col2X = rightAreaStartX + 140;
        let y = 70;
        const rowHeight = 25;
        
        enabledScores.forEach((field, index) => {
            const score = record[field.key as keyof GameRecord] as number || 0;
            
            const x = index % 2 === 0 ? col1X : col2X;
            const currentY = y + Math.floor(index / 2) * rowHeight;
            
            const text = `${field.label}: ${score}`;
            ctx.fillText(text, x, currentY);
        });
        
        // Finish date - positioned at the bottom
        if (record.finishDate) {
            const finishDate = new Date(record.finishDate);
            const dateString = finishDate.toLocaleDateString('de-DE'); // German format: DD.MM.YYYY
            
            ctx.font = '14px Arial';
            ctx.fillStyle = '#999999';
            ctx.textAlign = 'left';
            ctx.fillText(`finished on ${dateString}`, 20, height - 20);
        }
        
        return canvas;
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
}

