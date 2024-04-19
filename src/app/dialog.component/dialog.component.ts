import { Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

export interface FormDialog {
  overview: string;
  description: string;
  user: string;
  endDate: Date;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog-component.html',
  styleUrls: ['./dialog-component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class DialogContentDialog {
  myForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogContentDialog>) {
    this.myForm = new FormGroup({
      overview: new FormControl('Тестовое задание Php', Validators.required),
      description: new FormControl('описание задачи', Validators.required),
      user: new FormControl('Ответственный', Validators.required),
      endDate: new FormControl(new Date(), Validators.required),
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }
}
