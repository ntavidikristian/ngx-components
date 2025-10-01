import { Component, signal } from '@angular/core';
import { TickerTape } from "./components/ticker-tape/ticker-tape";

@Component({
  selector: 'app-root',
  imports: [TickerTape],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ngx-components');

  show = true;


  constructor(){
    // setTimeout(() => {
    //   this.show = false;
    // }, 2000);
  }
}
