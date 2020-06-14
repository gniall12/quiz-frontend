import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../backend.service";
import { Router } from "@angular/router";
import { SummaryComponent } from "../summary/summary.component";
import { environment } from "src/environments/environment";

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
    this.backendService.changeRoundAndProceed(0).subscribe((resp) => {
      this.router.navigate(["quizmaster/answer-questions"]);
    });
  }

  getQuizLink() {
    return `${this.baseUrl}?quiz-id=${this.quiz["id"]}`;
  }
}
