import { Component, OnInit } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { Router } from "@angular/router";
import { Quiz } from "src/app/interfaces/quiz";
import {
  Participant,
  ParticipantsResponse,
} from "src/app/interfaces/participant";

@Component({
  selector: "app-leaderboard",
  template: `No template`,
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnInit {
  participants: Array<Participant>;
  quiz: Quiz;
  finalRound: boolean;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.backendService
      .getParticipants()
      .subscribe((participantsResp: ParticipantsResponse) => {
        this.participants = participantsResp.participants.sort(
          (p1: Participant, p2: Participant) => (p1.score > p2.score ? -1 : 1)
        );
      });
    this.backendService.getQuiz().subscribe((quiz: Quiz) => {
      this.quiz = quiz;
      this.finalRound = this.quiz.current_round === this.quiz.number_rounds - 1;
    });
  }
}
