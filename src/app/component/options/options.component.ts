import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../service/authentication.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { CommonModelService } from "../../../app/service/common-model.service";
// import { MessageService } from '../../service/message.service';

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"]
})
export class OptionsComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authenticationService: AuthenticationService,
    // private messageService: MessageService,
    private router: Router,
    private commonModelService: CommonModelService
  ) {}

  ngOnInit() {}

  logout() {
    this.authenticationService.logout();
    // const loggedin = this.jwtService.loggedIn;
    // this.messageService._disconnect();
    this.router.navigate(["/login"]);
  }

  loggedInAs() {
    const nameMatch = this.authenticationService.currentUserValue.email.match(
      /^([^@]*)@/
    );
    // return nameMatch ? nameMatch[1] : null;
    return this.authenticationService.currentUserValue.email;
  }

  isDriver() {
    return this.authenticationService.currentUserValue.type === "DRIVER";
  }

  type() {
    return this.authenticationService.currentUserValue.type;
  }

  openPreferencesDialog() {
    this.commonModelService
      .openPreferencesDialog()
      .subscribe(data => {
        console.log(data);
        if (data.updated) {
          // this.fetchOrders(this.config.currentPage);
          // this.apiService
          //   .getAudit("Order", this.selectedOrder.id)
          //   .pipe(takeUntil(this.destroy$))
          //   .subscribe((response: AuditResponse[]) => {
          //     this.auditResponse = response;
          //     // console.log(`AuditResponse: ${response}`);
          //   });
        }
      });
  }
}
