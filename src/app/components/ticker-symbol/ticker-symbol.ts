import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TickerPrice } from '../../models/ticker-price.model';

@Component({
  selector: 'app-ticker-symbol',
  imports: [CurrencyPipe, PercentPipe],
  templateUrl: './ticker-symbol.html',
  styleUrl: './ticker-symbol.scss',
})
export class TickerSymbol {
  tickerPrice = input.required<TickerPrice>();
}
