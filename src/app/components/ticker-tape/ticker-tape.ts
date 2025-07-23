import { Component } from '@angular/core';
import { TickerSymbol } from "../ticker-symbol/ticker-symbol";
import { TickerPrice } from '../../models/ticker-price.model';

@Component({
  selector: 'app-ticker-tape',
  imports: [TickerSymbol],
  templateUrl: './ticker-tape.html',
  styleUrl: './ticker-tape.scss'
})
export class TickerTape {

  protected readonly prices: TickerPrice[] = new Array(10).fill(0).map((_, index) => ({
    delta: index * 0.1,
    price: 50 + index,
    ticker: 'A' + index
  }))

  
}
