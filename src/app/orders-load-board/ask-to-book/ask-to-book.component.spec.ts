import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskToBookComponent } from './ask-to-book.component';

describe('AskToBookComponent', () => {
  let component: AskToBookComponent;
  let fixture: ComponentFixture<AskToBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskToBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskToBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
