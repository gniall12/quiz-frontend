import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { BackendService } from "../../backend.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { AnswerQuestionsComponent } from "../answer-questions/answer-questions.component";

@Component({
  selector: "app-answer-questions-p",
  templateUrl: "./answer-questions-p.component.html",
  styleUrls: ["./answer-questions-p.component.css"],
})
export class AnswerQuestionsPComponent extends AnswerQuestionsComponent
  implements OnInit {
  answersFormData: FormGroup;
  subscription: Subscription;
  submitted: boolean;
  disableSubmit: boolean;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {
    super(backendService, router);
  }

  ngOnInit() {
    super.loadQuestions().subscribe(() => {
      this.questions.forEach((question) => {
        this.answersFormData.addControl(
          question["question"],
          new FormControl()
        );
      });
    });
    this.answersFormData = new FormGroup({});
    this.backendService.connectToChangeNotifications();
    this.subscription = this.backendService.changeViewEvent$.subscribe(() => {
      if (this.submitted) {
        this.router.navigate(["/correct-p"]);
      } else {
        this.submitAnswers().subscribe((resp) => {
          this.submitted = true;
          this.router.navigate(["/correct-p"]);
        });
      }
    });
    this.submitted = false;
  }

  onClickSubmit() {
    this.submitAnswers().subscribe((resp) => {
      this.submitted = true;
    });
  }

  submitAnswers(): Observable<Object> {
    this.questions.forEach((question) => {
      question["answer"] = this.answersFormData.value[question["question"]];
    });
    this.disableSubmit = true;
    return this.backendService.submitAnswers(this.questions);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
