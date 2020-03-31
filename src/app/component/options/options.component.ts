import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
    // const loggedin = this.jwtService.loggedIn;
    this.router.navigate(['/login']);
  }

  loggedInAs() {
    const nameMatch = this.authenticationService.currentUserValue.email.match(/^([^@]*)@/);
    return nameMatch ? nameMatch[1] : null;
  }

  isDriver() {
    return this.authenticationService.currentUserValue.type === 'DRIVER';
  }

}
