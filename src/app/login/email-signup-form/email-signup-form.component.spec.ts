import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSignupFormComponent } from './email-signup-form.component';

describe('EmailSignupFormComponent', () => {
  let component: EmailSignupFormComponent;
  let fixture: ComponentFixture<EmailSignupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSignupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
