import {
  Directive,
  HostBinding,
  HostListener,
  input,
  linkedSignal,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { map, scan } from 'rxjs';

const style = `
  @keyframes animate-diff-increment {
    from {
      background-color: lightgreen;
    }
    to {
      background-color: transparent;
    }
  }

  @keyframes animate-diff-decrement {
    from {
      background-color: red;
    }
    to {
      background-color: transparent;
    }
  }

  .increment {
    animation: 1s animate-diff-increment forwards ease;
  }

  .decrement {
    animation: 1s animate-diff-decrement forwards ease;
  }
`;

@Directive({
  selector: '[appAnimateDiff]',
})
export class AnimateDiff implements OnDestroy, OnInit {
  readonly value = input<number>(0);

  @HostBinding('class.decrement') get _decrement() {
    return this.animationDiff() < 0;
  }

  @HostBinding('class.increment') get _increment() {
    return this.animationDiff() > 0;
  }

  @HostListener('animationend', ['$event']) handleAnimationEnd(
    event: AnimationEvent
  ) {
    if (event.animationName.startsWith('animate-diff-')) {
      this.animationDiff.set(0);
    }
  }

  private readonly diff = toSignal(
    toObservable(this.value).pipe(
      scan(([previous], current) => [current, previous], [] as number[]),
      map(([current = 0, previous = 0]) => current - previous),
      takeUntilDestroyed()
    ),
    { initialValue: 0, equal: () => false }
  );
  private readonly animationDiff = linkedSignal(this.diff);

  private static count = 0;
  private stylesAppended?: HTMLStyleElement;
  constructor() {
  }

  ngOnInit(): void {
    if (!this.stylesAppended) {
      this.stylesAppended = document.createElement('style');
      this.stylesAppended.innerHTML = style;
      document.head.append(this.stylesAppended);
    }
    AnimateDiff.count++;
  }
  ngOnDestroy(): void {
    AnimateDiff.count--;
    if (AnimateDiff.count <= 0) {
      this.stylesAppended?.remove();
      this.stylesAppended = undefined;
    }
  }
}
