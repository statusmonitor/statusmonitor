import { TestBed } from '@angular/core/testing';

import { ErrorListService } from './error-list.service';

describe('ErrorListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorListService = TestBed.get(ErrorListService);
    expect(service).toBeTruthy();
  });
});
