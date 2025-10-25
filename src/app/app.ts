import { Component, signal } from '@angular/core';
import { TickerTape } from "./components/ticker-tape/ticker-tape";
import { CalendarLeafComponent } from "./components/calendar-leaf/calendar-leaf.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [TickerTape, CalendarLeafComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ngx-components');

  show = true;


  name = 'A';

  constructor(){

    setInterval(() => {
      this.name = (new Date()).toISOString();
    }, 1000);
    setTimeout(() => {
      this.show = false;
    }, 2000);
  }
}
