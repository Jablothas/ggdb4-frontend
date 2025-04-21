import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Rating } from 'primeng/rating';
import { RadioButton } from 'primeng/radiobutton';

import { RecordType } from '../../enum/type.enum';
import { Locations } from '../../enum/location.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { GameRecord } from '../../models/record.model';
import { ToastService } from '../../service/toast.service';
import { ConfirmationService } from 'primeng/api';
import { StatService } from '../../service/stat.service';
import { Toolbar } from 'primeng/toolbar';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ToggleSwitchModule, SelectModule, DatePickerModule, TextareaModule, FloatLabelModule, SliderModule, ButtonModule, Rating, RadioButton, Toolbar],
    providers: [StatService],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
    statService: StatService = inject(StatService);
    form!: FormGroup;
    formEditable = false;
    dataService = inject(DataService);
    recordTypes = Object.values(RecordType);
    locationTypes = Object.values(Locations);

    scoreFields: string[] = ['scoreGameplay', 'scorePresentation', 'scoreNarrative', 'scoreQuality', 'scoreSound', 'scoreContent', 'scorePacing', 'scoreBalance', 'scoreUIUX', 'scoreImpression'];

    scoreFieldComments: Record<string, string> = {
        scoreGameplay: 'How engaging and responsive was the core gameplay loop?',
        scorePresentation: 'Visuals, animations, polish and overall impression.',
        scoreNarrative: 'Storytelling, writing, characters, and world-building.',
        scoreQuality: 'Stability, bug-free experience, and polish level.',
        scoreSound: 'Music, sound effects, and audio design.',
        scoreContent: 'Amount and quality of content available.',
        scorePacing: 'Flow of progression and timing of major beats.',
        scoreBalance: 'Difficulty tuning and fair challenge.',
        scoreUIUX: 'Menus, HUD, and overall usability.',
        scoreImpression: 'Your overall impression.'
    };

    replayValueOptions = [
        { value: 1, label: 'No replay value' },
        { value: 2, label: 'Maybe someday' },
        { value: 3, label: 'Would replay' },
        { value: 4, label: 'Definitely again' },
        { value: 5, label: 'Can’t stop playing!' }
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private toast: ToastService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const recordParam = params['record'];
            if (recordParam === 'new') {
                this.formEditable = true;
                this.initForm();
            } else if (!isNaN(+recordParam)) {
                const record = this.dataService.getRecords().find((r) => r.id === +recordParam);
                if (record) {
                    this.formEditable = false;
                    this.initForm(record);
                } else {
                    console.warn('Record not found.');
                    this.formEditable = true;
                    this.initForm();
                }
            }
        });
    }

    initForm(record?: GameRecord): void {
        this.form = this.fb.group({
            id: [record?.id ?? 0],
            ownerId: [record?.ownerId ?? 0],
            name: [record?.name ?? '', Validators.required],
            status: [record?.status ?? ''],
            type: [record?.type ?? '', Validators.required],
            location: [record?.location ? Locations[record.location as keyof typeof Locations] : '', Validators.required],
            createDate: [record?.createDate ? new Date(record.createDate) : ''],
            finishDate: [record?.finishDate ? new Date(record.finishDate) : '', Validators.required],
            note: [record?.note ?? ''],
            replayValue: [record?.replayValue ?? null, Validators.required],
            mainQuestDone: [record?.mainQuestDone === 1],
            replay: [record?.replay === 1],
            ...Object.fromEntries(this.scoreFields.map((field) => [field, record?.[field as keyof GameRecord] ?? 1])),
            ...Object.fromEntries(this.scoreFields.map((field) => [`${field}Enabled`, record ? record[field as keyof GameRecord] !== 0 : true]))
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
        if (!this.formEditable) {
            this.form.disable();
        }
    }

    get totalScore(): number {
        const rawRecord: GameRecord = {
            ...this.form.value,
            mainQuestDone: this.form.value.mainQuestDone ? 1 : 0,
            replay: this.form.value.replay ? 1 : 0
        };
        return this.statService.getTotalScore(rawRecord);
    }

    toggleEdit(): void {
        this.formEditable = !this.formEditable;

        if (this.formEditable) {
            this.form.enable();
        } else {
            this.form.disable();
            this.initForm(this.form.value);
        }
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const raw = this.form.value;
        const payload = {
            id: raw.id,
            name: raw.name,
            status: raw.status,
            type: raw.type,
            location: this.getEnumKeyFromValue(Locations, raw.location),
            createDate: raw.createDate ? new Date(raw.createDate).toISOString().split('T')[0] : '',
            finishDate: raw.finishDate ? new Date(raw.finishDate).toISOString().split('T')[0] : '',
            note: raw.note,
            replay: raw.replay ? 1 : 0,
            mainQuestDone: raw.mainQuestDone ? 1 : 0,
            replayValue: raw.replayValue,
            ...Object.fromEntries(this.scoreFields.map((field) => [field, raw[field]]))
        };

        const username = this.dataService.loginService.getUsername();
        if (!username) {
            console.error('No username found');
            return;
        }

        const isUpdate = raw.id && raw.id > 0;
        const request$ = isUpdate ? this.dataService.updateRecord(username, payload) : this.dataService.createRecord(username, payload);

        request$.subscribe({
            next: () => {
                this.router.navigate(['/overview'], {
                    queryParams: {
                        toast: isUpdate ? 'updated' : 'created',
                        game: payload.name
                    }
                });
            },
            error: () => {
                this.toast.error(`${isUpdate ? 'Update' : 'Create'} failed`, 'Something went wrong while saving.');
            }
        });
    }

    confirmDelete(): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this entry-card?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.performDelete();
            }
        });
    }

    performDelete(): void {
        const id = this.form.get('id')?.value;
        const username = this.dataService.loginService.getUsername();
        if (!username || !id) return;

        this.dataService.deleteRecord(username, id).subscribe({
            next: () => {
                this.toast.success('Deleted', `${this.form.get('name')?.value} has been deleted.`);
                this.router.navigate(['/overview']);
            }
        });
    }

    reset(): void {
        this.form.reset();
    }

    getEnumKeyFromValue(enumObj: any, value: string): string {
        return Object.keys(enumObj).find((key) => enumObj[key] === value) || value;
    }

    returnToOverview() {
        this.router.navigate(['/overview'], {});
    }
}
