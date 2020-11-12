import { TestBed } from '@angular/core/testing';

import { UserNotVotedGuard } from './user-not-voted.guard';

describe('UserNotVotedGuard', () => {
  let guard: UserNotVotedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserNotVotedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
