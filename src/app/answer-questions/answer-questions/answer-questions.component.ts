import { Component, OnInit } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
  selector: "app-answer-questions",
  template: `No Template`,
  styleUrls: ["./answer-questions.component.css"],
})
export class AnswerQuestionsComponent implements OnInit {
  questions: Array<Object>;
  quiz: Object;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {}

  ngOnInit() {}

  loadQuestions() {
    return this.backendService.getQuizAndRoundQuestions().pipe(
      map((resp) => {
        this.questions = resp["questions"]["questions"];
        this.quiz = resp["quiz"];
      })
    );
  }
}
