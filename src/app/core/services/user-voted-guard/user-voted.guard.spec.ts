import { TestBed } from '@angular/core/testing';

import { UserVotedGuard } from './user-voted.guard';

describe('UserVotedGuard', () => {
  let guard: UserVotedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserVotedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
