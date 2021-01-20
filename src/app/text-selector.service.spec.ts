import { TestBed } from '@angular/core/testing';

import { TextSelectorService } from './text-selector.service';

describe('TextSelectorService', () => {
  let service: TextSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
