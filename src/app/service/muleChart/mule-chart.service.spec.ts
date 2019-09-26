import { TestBed } from '@angular/core/testing';

import { MuleChartService } from './mule-chart.service';

describe('MuleChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MuleChartService = TestBed.get(MuleChartService);
    expect(service).toBeTruthy();
  });
});
