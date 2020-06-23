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
  rounds: Array<FormArray>;
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

  public onAddQuestion(round: FormArray) {
    round.push(new FormControl(""));
  }

  public onAddRound() {
    this.rounds.push(new FormArray([]));
  }

  onSubmit() {
    this.disableSubmit = true;
    this.removeEmptyQuestions(this.rounds);
    this.removeEmptyRounds(this.rounds);
    const numRounds = this.rounds.length;
    const questions = this.rounds.map((formdata: FormArray, index: number) => {
      return {
        round_number: index,
        questions: formdata.value,
      };
    });
    this.backendService.addRounds(questions, numRounds).subscribe((resp) => {
      this.router.navigate(["quizmaster/summary"]);
    });
  }

  removeEmptyQuestions(rounds: Array<FormArray>) {
    rounds.forEach(function (round: FormArray) {
      // Use for loop instead of forEach to allow removing multiple items
      for (let i = round.controls.length - 1; i >= 0; i--) {
        if (round.controls[i].value === "") {
          round.controls.splice(i, 1);
        }
      }
    });
  }

  removeEmptyRounds(rounds: Array<FormArray>) {
    // Use for loop instead of forEach to allow removing multiple items
    for (let i = rounds.length - 1; i >= 0; i--) {
      if (rounds[i].length < 1) {
        rounds.splice(i, 1);
      }
    }
  }
}
