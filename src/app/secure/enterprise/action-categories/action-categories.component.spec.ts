import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCategoriesComponent } from './action-categories.component';

describe('ActionCategoriesComponent', () => {
  let component: ActionCategoriesComponent;
  let fixture: ComponentFixture<ActionCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
