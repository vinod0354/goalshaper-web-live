import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulseQestionComponent } from './pulse-qestion.component';

describe('PulseQestionComponent', () => {
  let component: PulseQestionComponent;
  let fixture: ComponentFixture<PulseQestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PulseQestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulseQestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
