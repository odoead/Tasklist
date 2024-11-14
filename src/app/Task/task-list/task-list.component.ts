import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TaskCardComponent } from '../task-card/task-card.component';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { EditTaskListComponent } from '../edit-task-list/edit-task-list.component';
import { Task } from '../../global/models/Task';
import { HistoryActivityService } from '../../global/services/history-activity.service';
import { TaskList } from '../../global/models/task-list';
import { TaskService } from '../../global/services/task.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    TaskCardComponent,
    CommonModule,MatGridListModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  @Input() list!: TaskList;
  @Input() allLists!: TaskList[];
  @Output() deleteList = new EventEmitter<number>();
  @Output() editList = new EventEmitter<TaskList>();

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private historyActivityService: HistoryActivityService
  ) {}

  onDeleteTask(taskId: number) {
    this.list.tasks = this.list.tasks.filter((t) => t.id !== taskId);
    this.taskService.deleteTask(taskId);
    this.historyActivityService.addActivity({
      taskId: taskId,
      change: `Deleted ${taskId}`,
      timestamp: new Date(),
    });
  }

  onAddTask() {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '500px',
      data: { listId: this.list.id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let newTask: Task = {
          description: result.description,
          dueDate: result.dueDate,
          name: result.name,
          priority: result.priority,
          id: this.taskService.getTasks().length + 1, // Generate a unique ID
          listId: result.listId,
        };
        this.list.tasks.push(newTask);
        this.taskService.addTask(newTask);
        this.historyActivityService.addActivity({
          taskId: newTask.id,
          change: `Created ${newTask.name}`,
          timestamp: new Date(),
        });
      }
    });
  }

  onEditTask(event: any) {
    let updatedTask: Task = {
      description: event.description,
      dueDate: event.dueDate,
      name: event.name,
      priority: event.priority,
      id: event.id,
      listId: event.listId,
    };
    const newList = this.allLists.find((l) => l.id === event.listId);
    if (newList) {
      const taskIndex = newList.tasks.findIndex((t) => t.id === event.id);
      if (taskIndex !== -1) {
        newList.tasks[taskIndex] = updatedTask;
      }

      this.taskService.updateTask(updatedTask);

      this.historyActivityService.addActivity({
        taskId: event.id,
        change: `Updated ${updatedTask.name}`,
        timestamp: new Date(),
      });
    }
  }
  onMoveTask(event: { taskId: number; newListId: number }) {
    const task = this.list.tasks.find((t) => t.id === event.taskId);
    if (task) {
      this.list.tasks = this.list.tasks.filter((t) => t.id !== event.taskId);
      const newList = this.allLists.find((l) => l.id === event.newListId);
      if (newList) {
        newList.tasks.push({ ...task, listId: event.newListId });
        this.taskService.updateTask({ ...task, listId: event.newListId });

        this.historyActivityService.addActivity({
          taskId: task.id,
          change: `Moved to ${newList.name}`,
          timestamp: new Date(),
        });
      }
    }
  }

  onEditListName() {
    const dialogRef = this.dialog.open(EditTaskListComponent, {
      width: '300px',
      data: { name: this.list.name },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.list.name = result.name;
        this.editList.emit(this.list);
        this.historyActivityService.addActivity({
          taskId: 0, // 0 indicates a list-level change
          change: `List renamed to ${result.name}`,
          timestamp: new Date(),
        });
      }
    });
  }

  onDeleteList() {
    this.deleteList.emit(this.list.id);
    this.historyActivityService.addActivity({
      taskId: 0, // 0 indicates a list-level change
      change: `List ${this.list.name} deleted`,
      timestamp: new Date(),
    });
  }
}
