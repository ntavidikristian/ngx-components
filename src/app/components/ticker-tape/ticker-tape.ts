import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, interval, map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ticker-tape',
  imports: [],
  templateUrl: './ticker-tape.html',
  styleUrl: './ticker-tape.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerTape implements OnInit {
  // * dependencies
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly tickersContainer = viewChild('tickersContainer', {
    read: ElementRef,
  });

  // ** effects

  #_triggerStartEffect = effect((onCleanup) => {
    // onCleanup();
    const element = this.tickersContainer()?.nativeElement as HTMLElement;
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

      observer.observe(this.tickersContainer()?.nativeElement);

      onCleanup(() => {
        observer.disconnect();
        cancel$.next();
      });
    });
  });

  ngOnInit(): void {}
}
