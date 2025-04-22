import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NAchtNComponent } from './nAchtN.component';

describe('NAchtNComponent', () => {
  let component: NAchtNComponent;
  let fixture: ComponentFixture<NAchtNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NAchtNComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NAchtNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
