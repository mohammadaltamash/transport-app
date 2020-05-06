import { TestBed } from '@angular/core/testing';

import { CommonModelService } from './common-model.service';

describe('CommonModelService', () => {
  let service: CommonModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
