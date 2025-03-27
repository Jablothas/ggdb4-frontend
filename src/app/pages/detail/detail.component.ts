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
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, SelectModule, DatePickerModule, TextareaModule, FloatLabelModule, SliderModule, ButtonModule, Fluid],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
    form!: FormGroup;

    statuses = ['New', 'In Progress', 'Completed'];
    recordTypes = Object.keys(RecordType);

    scoreFields: string[] = ['scoreGameplay', 'scorePresentation', 'scoreNarrative', 'scoreQuality', 'scoreSound', 'scoreContent', 'scorePacing', 'scoreBalance', 'scoreUIUX', 'scoreImpression'];

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
            ...Object.fromEntries(this.scoreFields.map((field) => [field, 0]))
        });
    }

    save(): void {
        console.log('Saving...', this.form.value);
    }

    reset(): void {
        this.form.reset();
    }
}
