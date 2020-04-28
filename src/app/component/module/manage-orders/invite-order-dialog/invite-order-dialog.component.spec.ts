import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteOrderDialogComponent } from './invite-order-dialog.component';

describe('InviteOrderDialogComponent', () => {
  let component: InviteOrderDialogComponent;
  let fixture: ComponentFixture<InviteOrderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteOrderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
