import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AppSpinnerService } from 'src/app/core/services/spinner-service/spinner.service';

@Component({
  selector: 'app-email-login-form',
  templateUrl: './email-login-form.component.html',
  styleUrls: ['./email-login-form.component.scss']
})
export class EmailLoginFormComponent implements OnInit {

  loginForm: FormGroup;
  loading = false as boolean;

  constructor(
    private fb: FormBuilder,
    private spinner: AppSpinnerService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  signInWithEmail(): void {
    this.loading = true;
    this.spinner.show('login');
    this.auth.emailPasswordSignIn({ email: this.email.value, password: this.password.value})
      .finally(() => {
        this.loading = false;
        this.spinner.hide('login');
      });
  }

  get email(): any { return this.loginForm.get('email'); }
  get password(): any { return this.loginForm.get('password'); }

  private buildForm(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(24)])
    });
  }

}
