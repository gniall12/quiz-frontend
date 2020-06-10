import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";
import { AnswerQuestionsComponent } from "../answer-questions/answer-questions.component";

@Component({
  selector: "app-answer-questions-qm",
  templateUrl: "./answer-questions-qm.component.html",
  styleUrls: ["./answer-questions-qm.component.css"],
})
export class AnswerQuestionsQmComponent extends AnswerQuestionsComponent
  implements OnInit {
  disableSubmit: boolean;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {
    super(backendService, router);
  }

  ngOnInit() {
    super.loadQuestions().subscribe();
    this.disableSubmit = false;
  }

  onEndRound() {
    this.disableSubmit = true;
    this.backendService.changePage().subscribe((resp) => {
      this.router.navigate(["correct-qm"]);
    });
  }
}
