import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { TickerSymbol } from '../ticker-symbol/ticker-symbol';
import { TickerPrice } from '../../models/ticker-price.model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { delay, interval, map, Subject, switchMap, takeUntil } from 'rxjs';
import { AnimateDiff } from '../../directives/animate-diff';

@Component({
  selector: 'app-ticker-tape',
  imports: [TickerSymbol, AnimateDiff],
  templateUrl: './ticker-tape.html',
  styleUrl: './ticker-tape.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerTape implements OnInit {
  // * inputs

  // * dependencies
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly tickersContaienr = viewChild('tickersContainer', {
    read: ElementRef,
  });

  // ** effects

  #_triggerStartEffect = effect((onCleanup) => {
    // onCleanup();
    const element = this.tickersContaienr()?.nativeElement as HTMLElement;
    if (!element) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const cancel$ = new Subject<void>();
      const source$ = new Subject<void>();
      source$
        .pipe(
          delay(1000),
          switchMap(() => interval(20).pipe(map((_, index) => index + 10))),
          takeUntilDestroyed(this.destroyRef),
          takeUntil(cancel$)
        )
        .subscribe((value) => {
          element.style.marginLeft = `calc( 100% - ${value}px)`;
        });

      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
          source$.next();
        }
      });

      observer.observe(this.tickersContaienr()?.nativeElement);

      onCleanup(() => {
        observer.disconnect();
        cancel$.next();
      });
    });
  });

  ngOnInit(): void {
    setInterval(() => {
      this.prices.update((prices) =>
        prices.map((x, index) =>
          index % 2 === 0
            ? { ...x, delta: x.delta + 1, price: x.price + 1 }
            : { ...x, delta: x.delta - 1, price: x.price - 1 }
        )
      );
    }, 2000);
  }

  protected prices = signal<TickerPrice[]>(
    new Array(100).fill(0).map((_, index) => ({
      delta: index * (index % 2 ? 1 : -1),
      price: 50 + index,
      ticker: 'A' + index,
    }))
  );
}
