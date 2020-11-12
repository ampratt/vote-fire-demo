import { TestBed } from '@angular/core/testing';

import { AdminElectionService } from './admin-election.service';

describe('AdminElectionService', () => {
  let service: AdminElectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminElectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
