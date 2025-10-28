import {
  Directive,
  input,
  linkedSignal,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { map, scan } from 'rxjs';
@Directive({
  selector: '[appAnimateDiff]',
  host: {
    '[class.decrement]': 'animationDiff() < 0',
    '[class.increment]': 'animationDiff() > 0',
    '(animationend)': 'handleAnimationEnd($event)',
  },
})
export class AnimateDiff implements OnDestroy, OnInit {
  readonly value = input<number>(0, { alias: 'appAnimateDiff' });
  
  private readonly diff = toSignal(
    toObservable(this.value).pipe(
      scan(([previous], current) => [current, previous], [] as number[]),
      map(([current = 0, previous = 0]) => current - previous),
      takeUntilDestroyed()
    ),
    { initialValue: 0, equal: () => false }
  );
  protected readonly animationDiff = linkedSignal(this.diff);
  private static count = 0;
  private stylesAppended?: HTMLStyleElement;

  protected handleAnimationEnd(event: AnimationEvent) {
    if (event.animationName.startsWith('animate-diff-')) {
      this.animationDiff.set(0);
    }
  }

  ngOnInit(): void {
    if (!this.stylesAppended) {
      this.stylesAppended = document.createElement('style');
      this.stylesAppended.innerHTML = AnimateDiff.AppendedStyles;
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

  private static readonly AppendedStyles = `
  @keyframes animate-diff-increment {
    from {
      background-color: rgba(0,255,0, .66);
    }
    to {
      background-color: transparent;
    }
  }

  @keyframes animate-diff-decrement {
    from {
      background-color: rgba(255,0,0, .66);
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
}
