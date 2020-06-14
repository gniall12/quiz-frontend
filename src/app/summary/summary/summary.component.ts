import { Component, OnInit } from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-summary",
  template: `No Template`,
  styleUrls: ["./summary.component.css"],
})
export class SummaryComponent implements OnInit {
  quiz: object;
  numRounds: number;
  numQuestions: number;

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
        roundSet.add(question["round"]);
      });
      this.numRounds = roundSet.size;
    });
  }
}
