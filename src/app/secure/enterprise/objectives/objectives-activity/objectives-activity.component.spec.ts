import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectivesActivityComponent } from './objectives-activity.component';

describe('ObjectivesActivityComponent', () => {
  let component: ObjectivesActivityComponent;
  let fixture: ComponentFixture<ObjectivesActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectivesActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectivesActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
