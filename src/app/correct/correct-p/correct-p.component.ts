import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BackendService } from "../../backend.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-correct-p",
  templateUrl: "./correct-p.component.html",
  styleUrls: ["./correct-p.component.css"],
})
export class CorrectPComponent implements OnInit {
  subscription: Subscription;

  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit() {
    this.backendService.connectToChangeNotifications();
    this.subscription = this.backendService.changeViewEvent$.subscribe(
      (resp) => {
        this.router.navigate(["participant/leaderboard"]);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
