import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';

// Enums/Types
import { RecordType } from '../../enum/type.enum';
import { Locations } from '../../enum/location.enum';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Rating } from 'primeng/rating';
import { RadioButton } from 'primeng/radiobutton';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ToggleSwitchModule, SelectModule, DatePickerModule, TextareaModule, FloatLabelModule, SliderModule, ButtonModule, Rating, RadioButton],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
    form!: FormGroup;

    statuses = ['New', 'In Progress', 'Completed'];
    recordTypes = Object.values(RecordType);
    locationTypes = Object.values(Locations);

    scoreFields: string[] = ['scoreGameplay', 'scorePresentation', 'scoreNarrative', 'scoreQuality', 'scoreSound', 'scoreContent', 'scorePacing', 'scoreBalance', 'scoreUIUX', 'scoreImpression'];
    scoreFieldComments: Record<string, string> = {
        scoreGameplay: 'How engaging and responsive was the core gameplay loop?',
        scorePresentation: 'Visuals, animations, polish and overall first impression.',
        scoreNarrative: 'Storytelling, writing, characters, and world-building.',
        scoreQuality: 'Stability, bug-free experience, and polish level.',
        scoreSound: 'Music, sound effects, and audio design.',
        scoreContent: 'Amount and quality of content available.',
        scorePacing: 'Flow of progression and timing of major beats.',
        scoreBalance: 'Difficulty tuning and fair challenge.',
        scoreUIUX: 'Menus, HUD, and overall usability.',
        scoreImpression: 'Your gut feeling. Would you recommend it?'
    };
    replayValueOptions = [
        { value: 1, label: 'No replay value' },
        { value: 2, label: 'Maybe someday' },
        { value: 3, label: 'Would replay' },
        { value: 4, label: 'Definitely again' },
        { value: 5, label: 'Can’t stop playing!' }
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            id: [0],
            ownerId: [0],
            name: [''],
            status: [''],
            type: [''],
            location: [''],
            createDate: [''],
            finishDate: [''],
            note: [''],
            replay: [0],
            replayValue: [0],
            mainQuestDone: [0],
            ...Object.fromEntries(this.scoreFields.map((field) => [field, 1])),
            ...Object.fromEntries(this.scoreFields.map((field) => [`${field}Enabled`, true]))
        });
        this.scoreFields.forEach((field) => {
            const toggleControl = this.form.get(`${field}Enabled`);
            const scoreControl = this.form.get(field);

            toggleControl?.valueChanges.subscribe((enabled) => {
                if (!enabled) {
                    scoreControl?.setValue(0);
                } else {
                    if (scoreControl?.value === 0) {
                        scoreControl.setValue(1);
                    }
                }
            });
        });
    }

    get totalScore(): number {
        const scores = this.scoreFields.map((field) => {
            const isEnabled = this.form.get(`${field}Enabled`)?.value;
            const value = this.form.get(field)?.value;
            return isEnabled ? value : 10; // Treat disabled score as full 10
        });
        const total = scores.reduce((a, b) => a + b, 0);
        const max = this.scoreFields.length * 10;
        const scaled = ((total - this.scoreFields.length) / (max - this.scoreFields.length)) * 90 + 10;
        return Math.round(scaled);
    }

    save(): void {
        console.log('Saving...', this.form.value);
    }

    reset(): void {
        this.form.reset();
    }
}
