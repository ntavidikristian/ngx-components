import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerSymbol } from './ticker-symbol';

describe('TickerSymbol', () => {
  let component: TickerSymbol;
  let fixture: ComponentFixture<TickerSymbol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TickerSymbol]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TickerSymbol);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
