import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BuildComponentimplements } from './global/build/build.component';
import { HistorySidebarComponent } from './history-sidebar/history-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BuildComponentimplements,
    HistorySidebarComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Tasklist';
}
