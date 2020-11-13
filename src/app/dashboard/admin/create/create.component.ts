import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AutoUnsubscribe } from 'src/app/core/decorators/auto-unsubscribe';
import { Election, ElectionStatus } from 'src/app/core/models/election.model';
import { User } from 'src/app/core/models/user.model';
import { AdminElectionService } from 'src/app/core/services/admin-election-service/admin-election.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NotificationsService } from 'src/app/core/services/notifications/notification.service';
import { AppSpinnerService } from 'src/app/core/services/spinner-service/spinner.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
@AutoUnsubscribe()
export class CreateComponent implements OnInit {

  user: User;
  election: Election;
  electionForm: FormGroup;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private adminElectionService: AdminElectionService,
    private spinner: AppSpinnerService,
    private notification: NotificationsService,
    private router: Router
  ) {
    this.auth.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => this.user = user);
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm(article = new Election()): void {
    this.electionForm = this.fb.group({
      id: new FormControl(article?.id),
      title: new FormControl(article?.title, [Validators.required]),
      startDate: new FormControl(article?.startDate || new Date(), [Validators.required]),
      endDate: new FormControl(article?.endDate || new Date(), [Validators.required]),
      candidates: this.fb.array([
        this.fb.control('', [Validators.required])
      ])
    });
  }

  get candidates(): FormArray { return this.electionForm.get('candidates') as FormArray; }

  addCandidate(): void {
    this.candidates.push(this.fb.control('', [Validators.required]));
  }

  removeCandidate(index: number): void {
    this.candidates.removeAt(index);
  }

  handleCancel(): void {
    this.buildForm();
    this.router.navigate(['/dashboard']);
  }

  handleSave(): void {
    const payload = this.getPayload();
    this.spinner.show();
    this.adminElectionService.createOrUpdate(payload)
      .then(() => {
        this.notification.success('New Election created');
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => this.notification.error('Somthing went wrong.', err))
      .finally(() => this.spinner.hide());
  }

  getPayload(): Election {
    const payload = {
      ...this.electionForm.value,
      titleUppercase: this.electionForm.value.title.toUpperCase(),
      status: ElectionStatus.DRAFT
    } as Election;

    return payload;
  }

}
