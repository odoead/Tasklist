import { Injectable } from '@angular/core';
import { TaskList } from '../models/task-list';
import { TaskService } from './task.service';
import { Task } from '../models/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskListService {
  private tasksLists: TaskList[] = [];

  constructor(private taskService: TaskService) {
    this.seedLists();
  }
  seedLists() {
    this.tasksLists.push({ id: 1, name: 'To Do', tasks: [] });
    this.tasksLists.push({ id: 2, name: 'Planned', tasks: [] });
    this.tasksLists.push({ id: 3, name: 'In Progress', tasks: [] });
    this.tasksLists.push({ id: 4, name: 'Closed', tasks: [] });
    this.tasksLists.forEach((list) => this.setTaskListWithItems(list.id));
  }
  setTaskListWithItems(tasklistId: number) {
    let list = this.tasksLists.find((list) => list.id === tasklistId);
    if (list) {
      let tasks: Task[] = this.taskService
        .getTasks()
        .filter((task) => task.listId === tasklistId);

      list.tasks.push(...tasks);
    }
  }
  getTaskLists(): TaskList[] {
    return this.tasksLists;
  }

  addTaskList(taskList: TaskList): void {
    const lists = this.getTaskLists();
    lists.push(taskList);
    this.tasksLists = lists;
  }

  updateTaskList(updatedList: TaskList): void {
    const lists = this.getTaskLists();
    const index = lists.findIndex((list) => list.id === updatedList.id);
    if (index !== -1) {
      lists[index] = updatedList;
      this.tasksLists = lists;
    }
  }

  deleteTaskList(listId: number): void {
    let lists = this.getTaskLists();
    lists = lists.filter((list) => list.id !== listId);
    this.tasksLists = lists;
  }
}
