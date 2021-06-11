import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { constants } from 'src/app/common/constants';
import { AuthGaurd } from 'src/app/services/authguard.service';
import { ILoginFailureReponse, ILoginSuccessReponse } from 'src/app/services/models/user.model';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private subscription$ = true;
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toaster: NotificationService,
    private router: Router,
    private authGuard: AuthGaurd
  ) {}

  ngOnDestroy(): void {
    /* Unsubscribing the observables */
    this.subscription$ = false;
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    if (this.authGuard.isUserLoggedIn()) {
      this.router.navigateByUrl('/users');
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(constants.EMAIL_PATTERN)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return this.loginForm.controls;
    }

    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    const loginSubscription: Subscription = this.userService
      .authenticateUser(data)
      .pipe(takeWhile(() => this.subscription$))
      .subscribe(
        (res: ILoginSuccessReponse) => {
          localStorage.setItem('token', res.token);
          this.toaster.notifySucess('Login Successful');
          this.router.navigateByUrl('/users');
        },
        (err: ILoginFailureReponse) => {
          this.toaster.notifyError(err.error.error);
        }
      );

      this.subscriptions.push(loginSubscription);
  }
}
