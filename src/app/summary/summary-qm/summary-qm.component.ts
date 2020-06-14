import { Component, OnInit, OnDestroy } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";
import { SummaryComponent } from "../summary/summary.component";
import { environment } from "src/environments/environment";
import { interval, Subscription, empty } from "rxjs";
import { switchMap, catchError, startWith, mergeMap } from "rxjs/operators";

@Component({
  selector: "app-summary-qm",
  templateUrl: "./summary-qm.component.html",
  styleUrls: ["./summary-qm.component.css"],
})
export class SummaryQmComponent extends SummaryComponent
  implements OnInit, OnDestroy {
  baseUrl: string;
  disableSubmit: boolean;
  participantSubscription: Subscription;
  participants: Array<object>;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {
    super(backendService, router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.participantSubscription = interval(5000)
      .pipe(
        startWith(0),
        mergeMap((obs) =>
          this.backendService.getParticipants().pipe(
            catchError((error) => {
              this.participants = [];
              return empty();
            })
          )
        )
      )
      .subscribe((res) => {
        this.participants = res["participants"];
      });
    this.baseUrl = environment.frontendUrl;
    this.disableSubmit = false;
  }

  onStartQuiz() {
    this.disableSubmit = true;
    this.backendService.changeRoundAndProceed(0).subscribe((resp) => {
      this.router.navigate(["quizmaster/answer-questions"]);
    });
  }

  getQuizLink() {
    return `${this.baseUrl}?quiz-id=${this.quiz["id"]}`;
  }

  onRemoveParticipant(participant) {
    this.backendService.deleteParticipant(participant).subscribe((res) => {
      console.log(res);
    });
  }

  ngOnDestroy() {
    this.participantSubscription.unsubscribe();
  }
}
