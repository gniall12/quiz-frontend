import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { AnswerQuestionsComponent } from "../answer-questions/answer-questions.component";
import { Answer } from "src/app/interfaces/answer";
import { Question } from "src/app/interfaces/question";
import { DataService } from "src/app/data.service";
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
  answers: Array<Answer>;

  constructor(
    protected backendService: BackendService,
    protected router: Router,
    protected dataService: DataService
  ) {
    super(backendService, router);
  }

  ngOnInit() {
    this.answers = [];
    this.answersFormData = new FormGroup({});
    super.loadQuestions().subscribe(() => {
      this.createAnswersAndForm();
    });
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

  createAnswersAndForm() {
    this.questions.forEach((question: Question) => {
      const answer: Answer = {
        id: null,
        question_id: question.id,
        participant_id: +this.dataService.getParticipantId(),
        answer: null,
        question: question,
        correct: null,
      };
      this.answers.push(answer);

      this.answersFormData.addControl(
        answer.question.question,
        new FormControl("", [Validators.required])
      );
    });
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
    this.answers.forEach((answer: Answer) => {
      answer.answer = this.answersFormData.value[answer.question.question];
    });
    this.disableSubmit = true;
    return this.backendService.submitAnswers(this.answers);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
