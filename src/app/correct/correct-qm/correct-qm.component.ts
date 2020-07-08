import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";
import { Quiz } from "src/app/interfaces/quiz";

@Component({
  selector: "app-correct-qm",
  templateUrl: "./correct-qm.component.html",
  styleUrls: ["./correct-qm.component.css"],
})
export class CorrectQmComponent implements OnInit {
  quiz: Quiz;
  participants: Array<object>;
  participantAnswers: Array<object>;
  disableSubmit: boolean;
  uncorrected: boolean;

  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit() {
    this.backendService.getParticipants().subscribe((resp) => {
      this.participants = resp["participants"];
    });
    this.backendService.getQuiz().subscribe((resp: Quiz) => {
      this.quiz = resp;
    });
    this.participantAnswers = [];
    this.disableSubmit = false;
    this.uncorrected = false;
  }

  onGetAnswers(participant, index) {
    if (participant["selected"]) {
      participant["selected"] = false;
      return;
    }
    participant["selected"] = true;
    if (!participant["answers"]) {
      this.backendService
        .getAnswers(participant["id"], this.quiz.current_round)
        .subscribe((resp) => {
          console.log(resp);
          this.participants[index]["answers"] = resp["answers"];
        });
    }
  }

  onCorrect(answer: object) {
    this.uncorrected = false;
    answer["correct"] = 1;
  }

  onIncorrect(answer: object) {
    this.uncorrected = false;
    answer["correct"] = -1;
  }

  onProceed() {
    if (!this.checkAllAnswersCorrected()) {
      this.uncorrected = true;
    } else {
      this.disableSubmit = true;
      this.participants.forEach(function (participant: Array<object>) {
        let numCorrect = 0;
        participant["answers"].forEach(function (answer) {
          if (answer["correct"] === 1) numCorrect += 1;
        });
        participant["score"] = participant["score"] + numCorrect;
      });

      this.backendService
        .setParticipantScores(this.participants)
        .subscribe((resp) => {
          this.router.navigate([`quizmaster/${resp["current_page"]}`]);
        });
    }
  }

  checkAllAnswersCorrected(): boolean {
    for (const participant of this.participants) {
      if (typeof participant["answers"] === "undefined") {
        return false;
      }
      for (const answer of participant["answers"]) {
        if (typeof answer["correct"] === "undefined") {
          return false;
        }
      }
    }
    return true;
  }
}
