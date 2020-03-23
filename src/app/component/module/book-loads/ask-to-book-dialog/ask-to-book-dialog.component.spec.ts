import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskToBookDialogComponent } from './ask-to-book-dialog.component';

describe('AskToBookDialogComponent', () => {
  let component: AskToBookDialogComponent;
  let fixture: ComponentFixture<AskToBookDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskToBookDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskToBookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
