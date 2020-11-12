import { TestBed } from '@angular/core/testing';

import { ElectionResolver } from './election-resolver.service';

describe('ElectionResolver', () => {
  let service: ElectionResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectionResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
