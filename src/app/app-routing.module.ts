import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { CreateQuizComponent } from "./create-quiz/create-quiz.component";
import { AnswerQuestionsQmComponent } from "./answer-questions/answer-questions-qm/answer-questions-qm.component";
import { SummaryQmComponent } from "./summary/summary-qm/summary-qm.component";
import { CorrectQmComponent } from "./correct/correct-qm/correct-qm.component";
import { LeaderboardQmComponent } from "./leaderboard/leaderboard-qm/leaderboard-qm.component";
import { SummaryPComponent } from "./summary/summary-p/summary-p.component";
import { AnswerQuestionsPComponent } from "./answer-questions/answer-questions-p/answer-questions-p.component";
import { LeaderboardPComponent } from "./leaderboard/leaderboard-p/leaderboard-p.component";
import { CorrectPComponent } from "./correct/correct-p/correct-p.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "create-quiz", component: CreateQuizComponent },
  { path: "summary-qm", component: SummaryQmComponent },
  { path: "summary-p", component: SummaryPComponent },
  { path: "answer-questions-qm", component: AnswerQuestionsQmComponent },
  { path: "answer-questions-p", component: AnswerQuestionsPComponent },
  { path: "correct-qm", component: CorrectQmComponent },
  { path: "correct-p", component: CorrectPComponent },
  { path: "leaderboard-qm", component: LeaderboardQmComponent },
  { path: "leaderboard-p", component: LeaderboardPComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
