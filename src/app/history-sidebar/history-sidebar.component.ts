import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HistoryActivity } from '../global/models/history-activity';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HistoryActivityService } from '../global/services/history-activity.service';
import { CommonModule } from '@angular/common';
import { BuildComponentimplements } from '../global/build/build.component';

@Component({
  selector: 'app-history-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    CommonModule,
    BuildComponentimplements,
  ],
  templateUrl: './history-sidebar.component.html',
  styleUrl: './history-sidebar.component.css',
})
export class HistorySidebarComponent {
  isOpen = false;
  toggle = new EventEmitter<void>();
  activities: HistoryActivity[] | null = [];
  private page: number = 0;
  private pageSize: number = 20;
  constructor(private historyActivityService: HistoryActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
  }
  /* 
  onToggleChange(event: any) {
    this.toggle.emit();
  }*/
  loadActivities(): void {
    this.activities =
      this.historyActivityService
        .getHistoryActivities()
        ?.slice(0, this.pageSize) ?? null;
  }

  loadMore(): void {
    this.page++;
    let activitiesToAdd =
      this.historyActivityService
        .getHistoryActivities()
        ?.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize) ??
      null;
    if (activitiesToAdd) {
      this.activities?.push(...activitiesToAdd);
    }
  }
}
