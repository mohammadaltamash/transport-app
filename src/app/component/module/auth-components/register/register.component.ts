import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fullName: '',
      password: ['', Validators.required],
      companyName: '',
      address: '',
      zip: '',
      phones: {},
      email: ['', [Validators.required, Validators.email]],
      type: ''
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authenticationService
      .register(this.registerForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        console.log(data);
        if (data) {
          alert(`User ${this.registerForm.get('email')} registered successfully!`);
          this.router.navigate(['/login']);
        }
      });
  }
}
