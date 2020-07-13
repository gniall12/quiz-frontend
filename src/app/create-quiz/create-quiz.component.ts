import { Component, OnInit } from "@angular/core";
import { BackendService } from "../backend.service";
import { FormControl, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { Quiz } from "../interfaces/quiz";

@Component({
  selector: "app-create-quiz",
  templateUrl: "./create-quiz.component.html",
  styleUrls: ["./create-quiz.component.css"],
})
export class CreateQuizComponent implements OnInit {
  quizName: string;
  rounds: Array<FormArray>;
  disableSubmit: boolean;
  emptyFormSubmitted: boolean;

  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit() {
    this.getQuizName();
    this.rounds = [new FormArray([])];
    this.disableSubmit = false;
    this.emptyFormSubmitted = false;
  }

  public getQuizName() {
    return this.backendService.getQuiz().subscribe((quiz: Quiz) => {
      this.quizName = quiz.name;
    });
  }

  public onAddQuestion(round: FormArray) {
    this.emptyFormSubmitted = false;
    round.push(new FormControl(""));
  }

  public onAddRound() {
    this.emptyFormSubmitted = false;
    this.rounds.push(new FormArray([]));
  }

  onSubmit() {
    this.removeEmptyQuestions(this.rounds);
    this.removeEmptyRounds(this.rounds);
    const numRounds = this.rounds.length;
    if (numRounds === 0) {
      this.emptyFormSubmitted = true;
      return;
    }
    this.disableSubmit = true;
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

  onRemoveQuestion(roundIndex: number, questionIndex: number) {
    const round = this.rounds[roundIndex];
    round.controls.splice(questionIndex, 1);
    round.value.splice(questionIndex, 1);
  }

  onRemoveRound(index: number) {
    this.rounds.splice(index, 1);
  }

  removeEmptyQuestions(rounds: Array<FormArray>) {
    rounds.forEach(function (round: FormArray) {
      // Use for loop instead of forEach to allow removing multiple items
      for (let i = round.value.length - 1; i >= 0; i--) {
        if (round.value[i] === "") {
          round.value.splice(i, 1);
        }
      }
    });
  }

  removeEmptyRounds(rounds: Array<FormArray>) {
    // Use for loop instead of forEach to allow removing multiple items
    for (let i = rounds.length - 1; i >= 0; i--) {
      if (rounds[i].value.length < 1) {
        rounds.splice(i, 1);
      }
    }
  }
}
