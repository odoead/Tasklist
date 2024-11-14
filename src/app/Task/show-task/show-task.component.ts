import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { CommonModule } from '@angular/common';
import { HistoryActivity } from '../../global/models/history-activity';
import { Task } from '../../global/models/Task';
import { HistoryActivityService } from '../../global/services/history-activity.service';
@Component({
  selector: 'app-show-task',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatListModule],
  templateUrl: './show-task.component.html',
  styleUrl: './show-task.component.css',
})
export class ShowTaskComponent {
  task: Task;
  relatedActivities: HistoryActivity[];

  constructor(
    public dialogRef: MatDialogRef<ShowTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private historyActivityService: HistoryActivityService
  ) {
    this.task = data;
    this.relatedActivities = this.getRelatedActivities();
  }

  close(): void {
    this.dialogRef.close();
  }

  private getRelatedActivities(): HistoryActivity[] {
    const allActivities = this.historyActivityService.getHistoryActivities();
    return (
      allActivities?.filter((activity) => activity.taskId === this.task.id) ||
      []
    );
  }
}
