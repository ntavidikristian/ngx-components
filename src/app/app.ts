import { Component, HostBinding, signal } from '@angular/core';
import { TickerTape } from './components/ticker-tape/ticker-tape';
import { CalendarLeafComponent } from './components/calendar-leaf/calendar-leaf.component';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { AnimateDiff } from './directives/animate-diff';
import { TickerSymbol } from './components/ticker-symbol/ticker-symbol';
import { TickerPrice } from './models/ticker-price.model';

@Component({
  selector: 'app-root',
  imports: [
    TickerTape,
    CalendarLeafComponent,
    FormsModule,
    AnimateDiff,
    TickerSymbol,
  ],
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

    setInterval(() => {
      this.items.update((prices) =>
        prices.map((x, index) => {
          const multiplier = Math.random() > 0.5 ? -.01 : .01;
          return {
            ...x,
            delta: Math.random() * multiplier,
            price: x.price,
          };
        })
      );
    }, 2000);
  }

  private formatDate(date: Date) {
    return format(date, 'pp');
  }

  readonly items = signal<TickerPrice[]>(
    new Array(100).fill(0).map(
      (_, index) =>
        ({
          delta: index * (index % 2 ? 1 : -1),
          price: 50 + index,
          ticker: 'A' + index,
        } satisfies TickerPrice)
    )
  );
}
