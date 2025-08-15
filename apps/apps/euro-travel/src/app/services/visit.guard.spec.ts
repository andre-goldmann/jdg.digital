import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { visitGuard } from './visit.guard';

describe('visitGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => visitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
