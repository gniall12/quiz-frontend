import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { AnswerQuestionsComponent } from "../answer-questions/answer-questions.component";
declare var $: any;

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
          new FormControl("", [Validators.required])
        );
      });
    });
    this.answersFormData = new FormGroup({});
    this.backendService.connectToChangeNotifications();
    // Complicated block - find alternative method
    this.subscription = this.backendService.changeViewEvent$.subscribe(
      (quizCurrentPage) => {
        const activeRoute = this.router.url.split("/").pop();
        if (activeRoute !== quizCurrentPage) {
          const nextRoute = `participant/${quizCurrentPage}`;
          if (this.submitted) {
            this.router.navigate([nextRoute]);
          } else {
            this.submitAnswers().subscribe(() => {
              this.submitted = true;
              this.router.navigate([nextRoute]);
            });
          }
        }
      }
    );
    this.submitted = false;
  }

  onClickSubmit(confirmedSubmit: boolean) {
    if (!confirmedSubmit && this.answersFormData.invalid) {
      $("#confirmSubmitModal").modal("show");
    } else {
      this.submitAnswers().subscribe((resp) => {
        this.submitted = true;
      });
    }
  }

  submitAnswers(): Observable<object> {
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
