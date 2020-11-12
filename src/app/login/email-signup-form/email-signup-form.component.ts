import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AppSpinnerService } from 'src/app/core/services/spinner-service/spinner.service';

@Component({
  selector: 'app-email-signup-form',
  templateUrl: './email-signup-form.component.html',
  styleUrls: ['./email-signup-form.component.scss']
})
export class EmailSignupFormComponent implements OnInit {

  registrationForm: FormGroup;
  loading = false as boolean;

  constructor(
    private fb: FormBuilder,
    private spinner: AppSpinnerService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  registerWithEmail(): void {
    this.loading = true;
    this.spinner.show('login');
    const payload = { email: this.email.value, password: this.password.value, displayName: this.displayName.value };
    this.auth.emailPasswordRegister(payload)
      .finally(() => {
        this.loading = false;
        this.spinner.hide('login');
      });
  }

  get email(): any { return this.registrationForm.get('email'); }
  get password(): any { return this.registrationForm.get('password'); }
  get displayName(): any { return this.registrationForm.get('displayName'); }

  private buildForm(): void {
    this.registrationForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]),
      displayName: new FormControl('', [Validators.required, Validators.maxLength(50)])
    });
  }

}
