import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTenantDialogComponent } from './service-tenant-dialog.component';

describe('ServiceTenantDialogComponent', () => {
  let component: ServiceTenantDialogComponent;
  let fixture: ComponentFixture<ServiceTenantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTenantDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceTenantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
