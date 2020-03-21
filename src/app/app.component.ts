import { Component } from '@angular/core';
import { JwtService } from './service/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transport-app-client';

  constructor(private jwtService: JwtService) {

  }

  loggedIn() {
    return this.jwtService.loggedIn;
  }
}
