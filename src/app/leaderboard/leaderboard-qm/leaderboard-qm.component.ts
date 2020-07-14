import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BackendService } from "../../backend.service";
import { LeaderboardComponent } from "../leaderboard/leaderboard.component";
import { Quiz } from "src/app/interfaces/quiz";

@Component({
  selector: "app-leaderboard-qm",
  templateUrl: "./leaderboard-qm.component.html",
  styleUrls: ["./leaderboard-qm.component.css"],
})
export class LeaderboardQmComponent extends LeaderboardComponent
  implements OnInit {
  loading: boolean;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {
    super(backendService, router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.loading = false;
  }

  onProceed() {
    this.loading = true;
    this.backendService
      .updateQuiz("answer-questions", this.quiz.current_round + 1)
      .subscribe((quiz: Quiz) => {
        this.loading = false;
        this.router.navigate([`quizmaster/${quiz.current_page}`]);
      });
  }
}
