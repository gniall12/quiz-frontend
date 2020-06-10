import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { BackendService } from "../backend.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DataService } from "../data.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  createQuiz: Boolean = false;
  joinQuiz: Boolean = false;
  createFormdata: FormGroup;
  joinFormdata: FormGroup;
  quizId: number;

  constructor(
    private backendService: BackendService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createFormdata = new FormGroup({
      quizName: new FormControl(),
    });
    this.joinFormdata = new FormGroup({
      participantName: new FormControl(),
      quizCode: new FormControl(),
    });
    this.route.queryParams.subscribe((params) => {
      if (params["quiz-id"]) {
        this.joinQuiz = true;
        this.joinFormdata.controls["quizCode"].setValue(params["quiz-id"]);
      }
    });
  }

  public onCreateQuiz() {
    this.createQuiz = !this.createQuiz;
    this.joinQuiz = false;
  }

  public onJoinQuiz() {
    this.createQuiz = false;
    this.joinQuiz = !this.joinQuiz;
  }

  public onCreateQuizSubmit() {
    const quizName: string = this.createFormdata.controls["quizName"].value;
    this.backendService.createQuiz(quizName).subscribe((resp) => {
      console.log(resp);
      this.dataService.setQuizId(resp["id"]);
      this.router.navigate(["create-quiz"]);
    });
  }

  public onJoinQuizSubmit() {
    const participantName: string = this.joinFormdata.controls[
      "participantName"
    ].value;
    const quizId: string = this.joinFormdata.controls["quizCode"].value;
    this.dataService.setQuizId(quizId);
    this.backendService.addParticipant(participantName).subscribe((resp) => {
      this.dataService.setParticipantId(resp["id"]);
      this.router.navigate(["summary-p"]);
    });
  }
}
