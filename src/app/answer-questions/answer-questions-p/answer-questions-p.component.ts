import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { BackendService } from "../../backend.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
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
      console.log("X");
      this.onSubmitAnswers();
    });
  }

  onSubmitAnswers() {
    console.log(this.questions);
    this.questions.forEach((question) => {
      question["answer"] = this.answersFormData.value[question["question"]];
    });
    this.backendService.submitAnswers(this.questions).subscribe((resp) => {
      this.router.navigate(["/correct-p"]);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
