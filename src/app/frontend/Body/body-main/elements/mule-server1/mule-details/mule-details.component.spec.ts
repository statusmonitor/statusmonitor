import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuleDetailsComponent } from './mule-details.component';

describe('MuleDetailsComponent', () => {
  let component: MuleDetailsComponent;
  let fixture: ComponentFixture<MuleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
