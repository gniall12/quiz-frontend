import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SummaryComponent } from "../summary/summary.component";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-summary-p",
  templateUrl: "./summary-p.component.html",
  styleUrls: ["./summary-p.component.css"],
})
export class SummaryPComponent extends SummaryComponent implements OnInit {
  subscription: Subscription;

  constructor(
    protected backendService: BackendService,
    protected dataService: DataService,
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

  participantRemoved(): boolean {
    if (typeof this.participants === "undefined") {
      return false;
    }
    const participantId = this.dataService.getParticipantId();
    for (const participant of this.participants) {
      if (participant["id"].toString() === participantId) {
        return false;
      }
    }
    this.subscription.unsubscribe();
    return true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
