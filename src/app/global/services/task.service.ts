import { Injectable } from '@angular/core';
import { Task } from '../models/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksList: Task[] = [];
  constructor() {
    this.SeedTasks();
  }
  public SeedTasks() {
    if (!localStorage.getItem('tasks')) {
      this.tasksList.push({
        id: 1,
        listId: 1,
        name: 'Task 1',
        description: 'Description 1',
        dueDate: new Date('2024-10-01'),
        priority: 'High',
      });

      this.tasksList.push({
        id: 2,
        listId: 1,
        name: 'Task 2',
        description: 'Description 2',
        dueDate: new Date('2024-10-02'),
        priority: 'Medium',
      });
      this.tasksList.push({
        id: 3,
        listId: 3,
        name: 'Task 3',
        description: 'Description 3',
        dueDate: new Date('2024-10-01'),
        priority: 'High',
      });
      localStorage.setItem('tasks', JSON.stringify(this.tasksList));
    }
  }
  getTask(taskId: number): Task | null {
    const tasks = this.getTasks();
    return tasks.find((task) => task.id === taskId) || null;
  }
  getTasks(): Task[] {
    const storedTasks = localStorage.getItem('tasks');
    let taskList: Task[] = [];
    if (storedTasks) {
      taskList = JSON.parse(storedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));
    }
    return taskList;
  }
  private saveTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  updateTask(updatedTask: Task): void {
    let tasks = this.getTasks();
    const index = tasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasks(tasks);
    }
  }
  deleteTask(taskId: number): void {
    const tasks = this.getTasks().filter((task) => task.id !== taskId);
    this.saveTasks(tasks);
  }
}
