import { Injectable } from '@angular/core';
import { HistoryActivity } from '../models/history-activity';

@Injectable({
  providedIn: 'root',
})
export class HistoryActivityService {
  constructor() {}
  getHistoryActivities(): HistoryActivity[] {
    const storedActivities = localStorage.getItem('historyActivities');

    return storedActivities
      ? JSON.parse(storedActivities).map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp),
        }))
      : [];
  }
  addActivity(historyActivity: HistoryActivity): void {
    const activities = this.getHistoryActivities();
    activities.push(historyActivity);
    this.saveActivities(activities);
  }

  private saveActivities(activities: HistoryActivity[]): void {
    localStorage.setItem('historyActivities', JSON.stringify(activities));
  }
}
