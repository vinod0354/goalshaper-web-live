import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsNewComponent } from './actions-new.component';

describe('ActionsNewComponent', () => {
  let component: ActionsNewComponent;
  let fixture: ComponentFixture<ActionsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
