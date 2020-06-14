import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SummaryComponent } from "../summary/summary.component";

@Component({
  selector: "app-summary-p",
  templateUrl: "./summary-p.component.html",
  styleUrls: ["./summary-p.component.css"],
})
export class SummaryPComponent extends SummaryComponent implements OnInit {
  subscription: Subscription;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {
    super(backendService, router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.backendService.connectToChangeNotifications();
    this.subscription = this.backendService.changeViewEvent$.subscribe(() => {
      this.router.navigate(["participant/answer-questions"]);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
