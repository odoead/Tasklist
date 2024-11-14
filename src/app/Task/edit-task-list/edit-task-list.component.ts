import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-task-list',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, FormsModule, MatInputModule],
  templateUrl: './edit-task-list.component.html',
  styleUrl: './edit-task-list.component.css',
})
export class EditTaskListComponent {
  constructor(
    public dialogRef: MatDialogRef<EditTaskListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  save() {
    this.dialogRef.close(this.data);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
