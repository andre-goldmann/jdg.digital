import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsOverviewComponent } from './tickets-overview.component';

describe('TicketsOverviewComponent', () => {
  let component: TicketsOverviewComponent;
  let fixture: ComponentFixture<TicketsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
