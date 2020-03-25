import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversListDialogComponent } from './drivers-list-dialog.component';

describe('DriversListDialogComponent', () => {
  let component: DriversListDialogComponent;
  let fixture: ComponentFixture<DriversListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
