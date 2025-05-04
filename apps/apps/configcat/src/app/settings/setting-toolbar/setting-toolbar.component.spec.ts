import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingToolbarComponent } from './setting-toolbar.component';

describe('SettingToolbarComponent', () => {
  let component: SettingToolbarComponent;
  let fixture: ComponentFixture<SettingToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
