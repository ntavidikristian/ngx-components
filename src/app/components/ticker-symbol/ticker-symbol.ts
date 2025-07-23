import { Component, input } from '@angular/core';
import { TickerPrice } from '../../models/ticker-price.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-ticker-symbol',
  imports: [DecimalPipe, CurrencyPipe],
  templateUrl: './ticker-symbol.html',
  styleUrl: './ticker-symbol.scss'
})
export class TickerSymbol {
  tickerPrice = input.required<TickerPrice>();
}
