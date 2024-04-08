import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.css'],
})
export class ValidationModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ValidationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  ngOnInit(): void {}

  onClickOnConfirm(): void {
    this.dialogRef.close(true);
  }

  onClickOnCancel(): void {
    this.dialogRef.close(false);
  }
}
