import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressHelpComponent } from './progress-help.component';

describe('ProgressHelpComponent', () => {
  let component: ProgressHelpComponent;
  let fixture: ComponentFixture<ProgressHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
