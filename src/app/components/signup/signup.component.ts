import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { constants } from 'src/app/common/constants';
import { IRegisterFailureResponse, IRegisterSucessResponse } from 'src/app/services/models/user.model';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  private subscription$ = true;
  private readonly subscriptions: Subscription[] = [];
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toaster: NotificationService,
    private router: Router
  ) {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(constants.EMAIL_PATTERN)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  
  get f() {
    return this.signUpForm.controls;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    /* Unsubscribing the observables */
    this.subscription$ = false;
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return this.signUpForm.controls;
    } else if (this.signUpForm.value.password != this.signUpForm.value.confirmPassword) {
      this.toaster.notifyError("Passwords are not matching");
      return this.signUpForm.controls;
    }

    const data = {
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    };
    const registrationSubscription: Subscription = this.userService
      .registerUser(data)
      .pipe(takeWhile(() => this.subscription$))
      .subscribe(
        (res: IRegisterSucessResponse) => {
          localStorage.setItem('token', res.token);
          this.toaster.notifySucess('Registration Successful');
          this.router.navigateByUrl('/login');
        },
        (err: IRegisterFailureResponse) => {
          this.toaster.notifyError(err.error.error);
        }
      );

    this.subscriptions.push(registrationSubscription);
  }
}
