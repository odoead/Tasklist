import {
  Component,
  EventEmitter,
  input,
  Input,
  Output,
  output,
} from '@angular/core';
import { Task } from '../../global/models/Task';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { CommonModule, NgForOf } from '@angular/common';
import { TaskList } from '../../global/models/task-list';
import { ShowTaskComponent } from '../show-task/show-task.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatMenuModule,
    CommonModule,
    NgForOf,
  ],providers:[],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  constructor(private dialog: MatDialog) {}
  @Input() task!: Task;
  @Input() taskLists!: TaskList[];
  @Output() deleteTask = new EventEmitter<{ id: number }>();
  @Output() editTask = new EventEmitter<{ newTask: any }>();
  @Output() moveTask = new EventEmitter<{
    taskId: number;
    newListId: number;
  }>();

  onCardClick(): void {
    if (this.task) {
      this.dialog.open(ShowTaskComponent, {
        width: '500px',
        data: this.task,
      });
    }
  }
  onEditTask() {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '600px',
      data: this.task,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editTask.emit({ ...result, id: this.task.id });
      }
    });
  }
  onMoveTask(newListId: number) {
    if (this.task) {
      this.moveTask.emit({ taskId: this.task.id, newListId: newListId });
    }
  }
  onDeleteTask(id: number) {
    this.deleteTask.emit({ id });
  }
}
