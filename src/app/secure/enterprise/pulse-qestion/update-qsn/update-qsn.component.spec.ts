import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQsnComponent } from './update-qsn.component';

describe('UpdateQsnComponent', () => {
  let component: UpdateQsnComponent;
  let fixture: ComponentFixture<UpdateQsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateQsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateQsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
