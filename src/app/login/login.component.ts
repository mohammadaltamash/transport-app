import { Component, OnInit } from '@angular/core';
import { JwtService } from '../service/jwt.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private jwtService: JwtService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.jwtService
      .login(
        this.loginForm.get('email').value,
        this.loginForm.get('password').value
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        console.log(data);
        if (this.jwtService.loggedIn) {
          this.router.navigate(['/']);
        }
      });
  }

  loggedIn() {
    return this.jwtService.loggedIn;
  }
}
