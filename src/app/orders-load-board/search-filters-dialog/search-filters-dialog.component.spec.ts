import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFiltersDialogComponent } from './search-filters-dialog.component';

describe('SearchFiltersDialogComponent', () => {
  let component: SearchFiltersDialogComponent;
  let fixture: ComponentFixture<SearchFiltersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFiltersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFiltersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
