import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HistoryActivityService } from '../services/history-activity.service';
import { TaskCardComponent } from '../../Task/task-card/task-card.component';
import { MatIconModule } from '@angular/material/icon';
import { TaskListComponent } from '../../Task/task-list/task-list.component';
import { TaskService } from '../services/task.service';
import { TaskList } from '../models/task-list';
import { EditTaskListComponent } from '../../Task/edit-task-list/edit-task-list.component';
import { TaskListService } from '../services/task-list.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-build',
  standalone: true,
  imports: [TaskCardComponent, MatIconModule, TaskListComponent, CommonModule],
  templateUrl: './build.component.html',
  styleUrl: './build.component.css',
})
export class BuildComponentimplements implements OnInit {
  taskLists: TaskList[] = [];
  isHistorySidebarOpen = false;

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private historyActivityService: HistoryActivityService,
    private taskListService: TaskListService
  ) {}

  ngOnInit() {
    this.loadTaskLists();
  }

  loadTaskLists() {
    this.taskLists = this.taskListService.getTaskLists();
  }

  onToggleHistorySidebar() {
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
  }

  addNewList() {
    const dialogRef = this.dialog.open(EditTaskListComponent, {
      width: '300px',
      data: { name: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newList: TaskList = {
          id: this.taskListService.getTaskLists().length + 1,
          name: result.name,
          tasks: [],
        };
        this.taskListService.addTaskList(newList);
        this.historyActivityService.addActivity({
          taskId: 0,
          change: `New list created: ${newList.name}`,
          timestamp: new Date(),
        });
      }
    });
  }

  onEditList(updatedList: TaskList) {
    const index = this.taskLists.findIndex(
      (list) => list.id === updatedList.id
    );
    if (index !== -1) {
      this.taskLists[index] = updatedList;
      this.taskListService.updateTaskList(updatedList);
    }
  }

  onDeleteList(listId: number) {
    this.taskLists = this.taskLists.filter((list) => list.id !== listId);
    this.taskListService.deleteTaskList(listId);
  }
}
