import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../global/models/Task';
import { TaskListService } from '../../global/services/task-list.service';
import { TaskList } from '../../global/models/task-list';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    RouterOutlet,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],

  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css',
})
export class EditTaskComponent {
  constructor(
    private dialogRef: MatDialogRef<EditTaskComponent>,
    private taskListService: TaskListService,
    @Inject(MAT_DIALOG_DATA) public data?: Task
  ) {}
  editTaskForm = new FormGroup({
    name: new FormControl<string>(this.data?.name ?? '', [Validators.required]),
    priority: new FormControl<string>(this.data?.priority ?? '', [
      Validators.required,
    ]),
    dueDate: new FormControl<Date>(this.data?.dueDate ?? new Date(), [
      Validators.required,
    ]),
    listId: new FormControl<number>(this.data?.listId ?? 0, [
      Validators.required,
    ]),
    description: new FormControl<string>(this.data?.description ?? '', [
      Validators.required,
    ]),
  });
  taskLists: TaskList[] = this.taskListService.getTaskLists();
  priorities = ['Low', 'Medium', 'High'];
  onSubmit() {
    if (this.editTaskForm.valid) {
      this.dialogRef.close(this.editTaskForm.value);
      console.log(this.editTaskForm.value);
    }
  }
}
