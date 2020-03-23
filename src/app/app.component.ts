import { Component } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transport-app-client';

  constructor(private authenticationService: AuthenticationService) {

  }

  loggedIn() {
    return this.authenticationService.loggedIn;
  }
}
