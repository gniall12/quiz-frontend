import { Component, OnInit, OnDestroy } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";
import { SummaryComponent } from "../summary/summary.component";
import { environment } from "src/environments/environment";
import { Participant } from "src/app/interfaces/participant";
import { Quiz } from "src/app/interfaces/quiz";

@Component({
  selector: "app-summary-qm",
  templateUrl: "./summary-qm.component.html",
  styleUrls: ["./summary-qm.component.css"],
})
export class SummaryQmComponent extends SummaryComponent implements OnInit {
  baseUrl: string;
  disableSubmit: boolean;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {
    super(backendService, router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.baseUrl = environment.frontendUrl;
    this.disableSubmit = false;
  }

  onStartQuiz() {
    this.disableSubmit = true;
    this.backendService
      .updateQuiz("answer-questions", 0)
      .subscribe((quiz: Quiz) => {
        this.router.navigate([`quizmaster/${quiz.current_page}`]);
      });
  }

  getQuizLink() {
    return `${this.baseUrl}?quiz-id=${this.quiz["id"]}`;
  }

  onRemoveParticipant(participant: Participant) {
    const participantIndex: number = this.participants.indexOf(participant);
    if (participantIndex > -1) {
      this.participants.splice(participantIndex, 1);
    }
    this.backendService.deleteParticipant(participant).subscribe((res) => {
      console.log(res);
    });
  }
}
