import { Component, OnInit, OnDestroy } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { Router } from "@angular/router";
import { interval, empty, Subscription } from "rxjs";
import { startWith, mergeMap, catchError } from "rxjs/operators";

@Component({
  selector: "app-summary",
  template: `No Template`,
  styleUrls: ["./summary.component.css"],
})
export class SummaryComponent implements OnInit, OnDestroy {
  quiz: object;
  numRounds: number;
  numQuestions: number;
  participantSubscription: Subscription;
  participants: Array<object>;

  constructor(
    protected backendService: BackendService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.backendService.getQuiz().subscribe((resp) => {
      this.quiz = resp;
    });
    this.loadRounds();
  }

  public loadRounds() {
    this.backendService.getAllQuestions().subscribe((resp) => {
      const questions = resp["questions"];
      this.numQuestions = questions.length;
      const roundSet = new Set([]);
      questions.forEach((question: object) => {
        roundSet.add(question["round_number"]);
      });
      this.numRounds = roundSet.size;
    });
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
  }

  ngOnDestroy() {
    this.participantSubscription.unsubscribe();
  }
}
