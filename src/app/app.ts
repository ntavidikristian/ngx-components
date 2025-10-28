import { Component, HostBinding, signal } from '@angular/core';
import { TickerTape } from './components/ticker-tape/ticker-tape';
import { CalendarLeafComponent } from './components/calendar-leaf/calendar-leaf.component';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { AnimateDiff } from "./directives/animate-diff";

@Component({
  selector: 'app-root',
  imports: [TickerTape, CalendarLeafComponent, FormsModule, AnimateDiff],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ngx-components');

  show = true;

  name = '';

  value = 0;

  protected readonly timeNow = signal(this.formatDate(new Date()));
  constructor() {
    setInterval(() => {
      // this.name = (new Date()).toISOString();
      this.timeNow.set(this.formatDate(new Date()));
    }, 1000);
    // setTimeout(() => {
    //   this.show = false;
    // }, 2000);
  }

  private formatDate(date: Date) {
    return format(date, 'pp');
  }
}
