import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BackendService } from "../backend.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DataService } from "../data.service";
import { Quiz } from "../interfaces/quiz";
import { Participant } from "../interfaces/participant";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  createQuiz: boolean = false;
  joinQuiz: boolean = false;
  createFormdata: FormGroup;
  joinFormdata: FormGroup;
  quizId: number;
  loading: boolean;
  joinErrorMessage: string;

  constructor(
    private backendService: BackendService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createFormdata = new FormGroup({
      quizName: new FormControl("", [Validators.required]),
    });
    this.joinFormdata = new FormGroup({
      participantName: new FormControl("", [Validators.required]),
      quizCode: new FormControl("", [Validators.required]),
    });
    this.route.queryParams.subscribe((params) => {
      if (params["quiz-id"]) {
        this.joinQuiz = true;
        this.joinFormdata.controls["quizCode"].setValue(params["quiz-id"]);
      }
    });
    this.loading = false;
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
    this.loading = true;
    const quizName: string = this.createFormdata.controls["quizName"].value;
    this.backendService.createQuiz(quizName).subscribe((quiz: Quiz) => {
      this.loading = false;
      this.dataService.setQuizId(quiz.id.toString());
      this.router.navigate(["create-quiz"]);
    });
  }

  public onJoinQuizSubmit() {
    this.loading = true;
    const participantName: string = this.joinFormdata.controls[
      "participantName"
    ].value;
    const quizId: string = this.joinFormdata.controls["quizCode"].value;
    this.dataService.setQuizId(quizId);
    this.backendService.addParticipant(participantName).subscribe(
      (participant: Participant) => {
        this.loading = false;
        this.dataService.setParticipantId(participant.id.toString());
        this.router.navigate(["participant/summary"]);
      },
      (error) => {
        this.loading = false;
        this.joinErrorMessage = error["error"]["message"];
        if (error.status == 404)
          this.joinErrorMessage += ". Did you enter the right code?";
      }
    );
  }
}
