import { TestBed } from '@angular/core/testing';

import { AllServerStateService } from './all-server-state.service';

describe('AllServerStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllServerStateService = TestBed.get(AllServerStateService);
    expect(service).toBeTruthy();
  });
});
