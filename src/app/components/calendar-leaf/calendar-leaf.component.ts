import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-calendar-leaf',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-leaf.component.html',
  styleUrl: './calendar-leaf.component.scss',
})
export class CalendarLeafComponent {
  readonly symbol = input<string>('');

  private readonly _symbol = computed(
    () => this.symbol()?.toString()?.at(0) ?? ''
  );

  protected readonly currentSymbol = signal('');
  protected readonly nextSymbol = computed(() =>
    this.isAnimating() ? untracked(this._symbol) : this._symbol()
  );
  private readonly isAnimating = signal(false);

  #_updateSymbolEffect = effect(() => {
    const currentSymbol = this.currentSymbol();
    const nextSymbol = this.nextSymbol();

    if (currentSymbol === nextSymbol) {
      return;
    }
    if (this.isAnimating()) {
      return;
    }

    // untracked(() => {
    this.moveTo(nextSymbol);
    // });
  });

  private readonly leafElement =
    viewChild<ElementRef<HTMLElement>>('leafContainer');

  ngOnInit() {
    this.leafElement()?.nativeElement.addEventListener('animationend', (ev) => {
      if (ev.animationName.endsWith('bottom-rotate')) {
        this.animationFinished();
      }
    });
  }
  moveTo(nextSymbol: string) {
    this.isAnimating.set(true);
    this.leafElement()!.nativeElement.dataset['animatingSymbol'] = nextSymbol;
    this.leafElement()!.nativeElement.classList.add('animate');
  }
  animationFinished() {
    this.currentSymbol.set(
      this.leafElement()!.nativeElement.dataset['animatingSymbol']!
    );
    this.leafElement()!.nativeElement.classList.remove('animate');
    setTimeout(() => {
      this.isAnimating.set(false);
    });
  }
  ngOnDestroy() {
    this.leafElement()?.nativeElement.removeEventListener(
      'animationend',
      this.animationFinished
    );
  }
}
