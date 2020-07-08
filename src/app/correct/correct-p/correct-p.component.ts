import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BackendService } from "../../backend.service";
import { Subscription } from "rxjs";
import { Quiz } from "src/app/interfaces/quiz";

@Component({
  selector: "app-correct-p",
  templateUrl: "./correct-p.component.html",
  styleUrls: ["./correct-p.component.css"],
})
export class CorrectPComponent implements OnInit {
  subscription: Subscription;
  quiz: Quiz;

  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit() {
    this.backendService.connectToChangeNotifications();
    this.subscription = this.backendService.changeViewEvent$.subscribe(
      (quizCurrentPage) => {
        const activeRoute = this.router.url.split("/").pop();
        if (activeRoute !== quizCurrentPage)
          this.router.navigate([`participant/${quizCurrentPage}`]);
      }
    );
    this.backendService.getQuiz().subscribe((resp: Quiz) => {
      this.quiz = resp;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
