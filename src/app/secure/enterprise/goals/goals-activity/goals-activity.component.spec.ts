import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsActivityComponent } from './goals-activity.component';

describe('GoalsActivityComponent', () => {
  let component: GoalsActivityComponent;
  let fixture: ComponentFixture<GoalsActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalsActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
