import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuleServer2Component } from './mule-server2.component';

describe('MuleServer2Component', () => {
  let component: MuleServer2Component;
  let fixture: ComponentFixture<MuleServer2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuleServer2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuleServer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
