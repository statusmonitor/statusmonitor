import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mule2DetailsComponent } from './mule2-details.component';

describe('Mule2DetailsComponent', () => {
  let component: Mule2DetailsComponent;
  let fixture: ComponentFixture<Mule2DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mule2DetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mule2DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
