import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-correct-qm",
  templateUrl: "./correct-qm.component.html",
  styleUrls: ["./correct-qm.component.css"],
})
export class CorrectQmComponent implements OnInit {
  quiz: Object;
  participants: Array<Object>;
  participantAnswers: Array<Object>;
  disableSubmit: boolean;

  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit() {
    this.backendService.getParticipants().subscribe((resp) => {
      this.participants = resp["participants"];
    });
    this.backendService.getQuiz().subscribe((resp) => {
      this.quiz = resp;
    });
    this.participantAnswers = [];
    this.disableSubmit = false;
  }

  onGetAnswers(participant, index) {
    this.backendService
      .getAnswers(participant["id"], this.quiz["current_round"])
      .subscribe((resp) => {
        console.log(resp);
        this.participants[index]["answers"] = resp["answers"];
      });
  }

  onCorrect(answer: Object) {
    answer["correct"] = 1;
  }

  onIncorrect(answer: Object) {
    answer["correct"] = -1;
  }

  onProceed() {
    this.disableSubmit = true;
    this.participants.forEach(function (participant: Array<Object>) {
      let numCorrect = 0;
      participant["answers"].forEach(function (answer) {
        if (answer["correct"] === 1) numCorrect += 1;
      });
      participant["score"] = participant["score"] + numCorrect;
    });

    this.backendService
      .setParticipantScores(this.participants)
      .subscribe((resp) => {
        this.router.navigate(["quizmaster/leaderboard"]);
      });
  }
}
