import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  year: number = 2024;
  month: number = 8; // 0-based index: 0 = January, 1 = February, ..., 8 = September
  daysOfWeek: { date: number; dayOfWeek: number; tasks: any[] }[] = [];
  tasksByDate: { [key: string]: any[] } = {}; // { 'YYYY-MM-DD': [tasks] }

  constructor() {
    this.loadTasksFromLocalStorage();
    this.generateCalendar(this.year, this.month);
  }

  getTasksByDate(day: number): any[] | undefined {
    return this.daysOfWeek.find((d) => d.date === day)?.tasks;
  }
  loadTasksFromLocalStorage(): void {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    this.tasksByDate = {};

    tasks.forEach((task: any) => {
      const taskDate = new Date(task.date);
      const key = `${taskDate.getFullYear()}-${
        taskDate.getMonth() + 1
      }-${taskDate.getDate()}`;

      if (!this.tasksByDate[key]) {
        this.tasksByDate[key] = [];
      }
      this.tasksByDate[key].push(task);
    });
  }

  generateCalendar(year: number, month: number): void {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.daysOfWeek = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = ((date.getDay() + 6) % 7) + 1; // Преобразование дня недели так, чтобы неделя начиналась с понедельника
      const dateKey = `${year}-${month + 1}-${day}`;
      const tasks = this.tasksByDate[dateKey] || [];
      this.daysOfWeek.push({ date: day, dayOfWeek, tasks });
    }
  }

  getWeeks(): number[][] {
    const weeks: number[][] = [];
    let week: number[] = [];

    const prevMonth = this.month === 0 ? 11 : this.month - 1; // Индекс предыдущего месяца
    const daysInPrevMonth = new Date(this.year, prevMonth + 1, 0).getDate();

    // Заполняем первую неделю
    for (let i = 1; i < this.daysOfWeek[0]?.dayOfWeek; i++) {
      week.unshift(daysInPrevMonth - (this.daysOfWeek[0].dayOfWeek - i) + 1);
    }

    this.daysOfWeek.forEach((day) => {
      week.push(day.date);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });

    const lastDayOfWeek = week.length < 7 ? week.length : 0;
    for (let i = lastDayOfWeek; i < 7; i++) {
      week.push(i + 1); // Номер дня из следующего месяца
    }

    // Добавляем последнюю неделю, если она не полная
    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  }
}
