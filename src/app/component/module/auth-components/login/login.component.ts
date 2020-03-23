import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../service/authentication.service';
import { ApiService } from '../../../../service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../../../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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
          this.router.navigate(['/']);
        }
      });
  }

  loggedIn() {
    return this.authenticationService.loggedIn;
  }
}
