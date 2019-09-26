import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuleServer1Component } from './mule-server1.component';

describe('MuleServer1Component', () => {
  let component: MuleServer1Component;
  let fixture: ComponentFixture<MuleServer1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuleServer1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuleServer1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
