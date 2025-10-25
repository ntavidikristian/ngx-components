import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarLeafComponent } from './calendar-leaf.component';

describe('CalendarLeafComponent', () => {
  let component: CalendarLeafComponent;
  let fixture: ComponentFixture<CalendarLeafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarLeafComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarLeafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
