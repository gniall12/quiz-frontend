import { Component, OnInit } from "@angular/core";
import { BackendService } from "../backend.service";
import { FormControl, FormArray } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-quiz",
  templateUrl: "./create-quiz.component.html",
  styleUrls: ["./create-quiz.component.css"],
})
export class CreateQuizComponent implements OnInit {
  quizName: string;
  rounds;
  disableSubmit: boolean;

  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit() {
    this.getQuizName();
    this.rounds = [new FormArray([])];
    this.disableSubmit = false;
  }

  public getQuizName() {
    return this.backendService.getQuiz().subscribe((res) => {
      this.quizName = res["name"];
    });
  }

  public onAddQuestion(round) {
    round.push(new FormControl(""));
  }

  public onAddRound() {
    this.rounds.push(new FormArray([]));
  }

  onSubmit() {
    this.disableSubmit = true;
    const numRounds = this.rounds.length;
    const questions = this.rounds.map((formdata, index: number) => {
      return {
        round_number: index,
        questions: formdata.value,
      };
    });
    this.backendService.addRounds(questions, numRounds).subscribe((resp) => {
      this.router.navigate(["quizmaster/summary"]);
    });
  }
}
