import { TestBed } from '@angular/core/testing';

import { WebloginService } from './weblogin.service';

describe('WebloginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebloginService = TestBed.get(WebloginService);
    expect(service).toBeTruthy();
  });
});
