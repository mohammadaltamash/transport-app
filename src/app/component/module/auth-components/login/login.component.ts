import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../service/authentication.service';
import { ApiService } from '../../../../service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../../model/user';

import { ErrorHandler } from '../../../../helper/error_handler';
import { MessageService } from '../../../../service/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  returnUrl: string;
  invalid: boolean;
  timedOut: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public errorHandler: ErrorHandler
  ) {
    if (localStorage.getItem('timedOut') !== null) {
      this.timedOut = true;
      localStorage.removeItem('timedOut');
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService
      .login(
        this.loginForm.get('email').value,
        this.loginForm.get('password').value
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: User) => {
        console.log(data);
        if (this.authenticationService.loggedIn) {
          // this.messageService.connect();
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error => {
        this.invalid = true;
      });
  }

  loggedIn() {
    return this.authenticationService.loggedIn;
  }

  get formControls() {
    return this.loginForm.controls;
  }
}
