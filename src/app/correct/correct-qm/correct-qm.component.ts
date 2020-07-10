import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";
import { Quiz } from "src/app/interfaces/quiz";
import {
  Participant,
  ParticipantsResponse,
} from "src/app/interfaces/participant";
import { Answer, AnswersResponse } from "src/app/interfaces/answer";

@Component({
  selector: "app-correct-qm",
  templateUrl: "./correct-qm.component.html",
  styleUrls: ["./correct-qm.component.css"],
})
export class CorrectQmComponent implements OnInit {
  quiz: Quiz;
  participants: Array<Participant>;
  participantAnswers: Array<Answer>;
  disableSubmit: boolean;
  uncorrected: boolean;

  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit() {
    this.backendService
      .getParticipants()
      .subscribe((participantsResp: ParticipantsResponse) => {
        this.participants = participantsResp.participants;
      });
    this.backendService.getQuiz().subscribe((resp: Quiz) => {
      this.quiz = resp;
    });
    this.participantAnswers = [];
    this.disableSubmit = false;
    this.uncorrected = false;
  }

  onGetAnswers(participant: Participant, index: number) {
    if (participant.selected) {
      participant.selected = false;
      return;
    }
    participant.selected = true;
    if (!participant.answers) {
      this.backendService
        .getAnswers(participant.id, this.quiz.current_round)
        .subscribe((answersResp: AnswersResponse) => {
          this.participants[index].answers = answersResp.answers;
        });
    }
  }

  onCorrect(answer: Answer) {
    this.uncorrected = false;
    answer.correct = true;
  }

  onIncorrect(answer: Answer) {
    this.uncorrected = false;
    answer.correct = false;
  }

  onProceed() {
    if (!this.checkAllAnswersCorrected()) {
      this.uncorrected = true;
    } else {
      this.disableSubmit = true;
      this.participants.forEach(function (participant: Participant) {
        let numCorrect = 0;
        participant.answers.forEach(function (answer) {
          if (answer.correct) numCorrect += 1;
        });
        participant.score = participant.score + numCorrect;
      });

      this.backendService
        .setParticipantScores(this.participants)
        .subscribe((quiz: Quiz) => {
          this.router.navigate([`quizmaster/${quiz.current_page}`]);
        });
    }
  }

  checkAllAnswersCorrected(): boolean {
    for (const participant of this.participants) {
      if (typeof participant.answers === "undefined") {
        return false;
      }
      for (const answer of participant.answers) {
        if (
          typeof answer["correct"] === "undefined" ||
          answer.correct === null
        ) {
          return false;
        }
      }
    }
    return true;
  }
}
