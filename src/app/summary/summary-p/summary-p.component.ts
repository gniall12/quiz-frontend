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
  participantRemoved: boolean;
  participantRemoveSub: Subscription;

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
    this.subscription = this.backendService.changeViewEvent$.subscribe(
      (quizCurrentPage) => {
        const activeRoute = this.router.url.split("/").pop();
        if (activeRoute !== quizCurrentPage)
          this.router.navigate([`participant/${quizCurrentPage}`]);
      }
    );
    this.participantRemoveSub = this.participantObs.subscribe(() => {
      this.checkParticipantRemoved();
    });
  }

  checkParticipantRemoved() {
    if (this.participants.length === 0) {
      this.participantRemoved = true;
      return;
    }
    const participantId = this.dataService.getParticipantId();
    for (const participant of this.participants) {
      if (participant.id.toString() === participantId) {
        this.participantRemoved = false;
        return;
      }
    }
    this.subscription.unsubscribe();
    this.participantRemoved = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.participantRemoveSub.unsubscribe();
  }
}
