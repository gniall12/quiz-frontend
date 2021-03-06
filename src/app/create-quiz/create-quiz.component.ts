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
  loading: boolean;
  emptyFormSubmitted: boolean;

  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit() {
    this.getQuizName();
    this.rounds = [new FormArray([])];
    this.loading = false;
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
    this.loading = true;
    this.removeEmptyQuestions();
    this.removeEmptyRounds();
    const numRounds = this.rounds.length;
    if (numRounds === 0) {
      this.emptyFormSubmitted = true;
      this.loading = false;
      return;
    }
    const questions = this.rounds.map((formdata: FormArray, index: number) => {
      return {
        round_number: index,
        questions: formdata.value,
      };
    });
    this.backendService.addRounds(questions, numRounds).subscribe((resp) => {
      this.loading = false;
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

  removeEmptyQuestions() {
    this.rounds.forEach(function (round: FormArray) {
      // Use for loop instead of forEach to allow removing multiple items
      for (let i = round.value.length - 1; i >= 0; i--) {
        if (round.value[i] === "") {
          round.value.splice(i, 1);
        }
      }
    });
  }

  removeEmptyRounds() {
    // Use for loop instead of forEach to allow removing multiple items
    for (let i = this.rounds.length - 1; i >= 0; i--) {
      if (this.rounds[i].value.length < 1) {
        this.rounds.splice(i, 1);
      }
    }
  }
}
