import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LeaderboardComponent } from "../leaderboard/leaderboard.component";

@Component({
  selector: "app-leaderboard-p",
  templateUrl: "./leaderboard-p.component.html",
  styleUrls: ["./leaderboard-p.component.css"],
})
export class LeaderboardPComponent extends LeaderboardComponent
  implements OnInit {
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
