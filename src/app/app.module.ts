import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { ClipboardModule } from "@angular/cdk/clipboard";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BackendService } from "./backend.service";
import { DataService } from "./data.service";

import { HomeComponent } from "./home/home.component";
import { CreateQuizComponent } from "./create-quiz/create-quiz.component";
import { SummaryComponent } from "./summary/summary/summary.component";
import { SummaryQmComponent } from "./summary/summary-qm/summary-qm.component";
import { SummaryPComponent } from "./summary/summary-p/summary-p.component";
import { AnswerQuestionsComponent } from "./answer-questions/answer-questions/answer-questions.component";
import { AnswerQuestionsQmComponent } from "./answer-questions/answer-questions-qm/answer-questions-qm.component";
import { AnswerQuestionsPComponent } from "./answer-questions/answer-questions-p/answer-questions-p.component";
import { CorrectQmComponent } from "./correct/correct-qm/correct-qm.component";
import { CorrectPComponent } from "./correct/correct-p/correct-p.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard/leaderboard.component";
import { LeaderboardQmComponent } from "./leaderboard/leaderboard-qm/leaderboard-qm.component";
import { LeaderboardPComponent } from "./leaderboard/leaderboard-p/leaderboard-p.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateQuizComponent,
    AnswerQuestionsQmComponent,
    SummaryQmComponent,
    SummaryPComponent,
    AnswerQuestionsPComponent,
    CorrectQmComponent,
    CorrectPComponent,
    LeaderboardQmComponent,
    LeaderboardPComponent,
    SummaryComponent,
    AnswerQuestionsComponent,
    LeaderboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClipboardModule,
  ],
  providers: [BackendService, DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
