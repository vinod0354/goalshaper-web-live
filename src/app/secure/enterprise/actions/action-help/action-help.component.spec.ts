import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionHelpComponent } from './action-help.component';

describe('ActionHelpComponent', () => {
  let component: ActionHelpComponent;
  let fixture: ComponentFixture<ActionHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
