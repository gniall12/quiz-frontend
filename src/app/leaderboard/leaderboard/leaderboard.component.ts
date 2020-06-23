import { Component, OnInit } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-leaderboard",
  template: `No template`,
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnInit {
  participants: Array<object>;
  quiz: object;
  finalRound: boolean;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.backendService.getParticipants().subscribe((resp) => {
      this.participants = resp["participants"].sort((p1: object, p2: object) =>
        p1["score"] > p2["score"] ? -1 : 1
      );
    });
    this.backendService.getQuiz().subscribe((resp) => {
      this.quiz = resp;
      this.finalRound =
        this.quiz["current_round"] === this.quiz["number_rounds"] - 1;
    });
  }
}
