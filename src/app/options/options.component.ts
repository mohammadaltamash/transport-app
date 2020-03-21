import { Component, OnInit } from '@angular/core';
import { JwtService } from '../service/jwt.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private jwtService: JwtService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.jwtService.logout();
    // const loggedin = this.jwtService.loggedIn;
    this.router.navigate(['/login']);
  }

}
