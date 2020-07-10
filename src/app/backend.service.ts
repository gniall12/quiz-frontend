import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { switchMap, map } from "rxjs/operators";
import { Subject, forkJoin, concat, Observable } from "rxjs";
import { DataService } from "./data.service";
import { environment } from "./../environments/environment";
import { Quiz } from "./interfaces/quiz";
import { Participant, ParticipantsResponse } from "./interfaces/participant";
import { Answer, AnswersResponse } from "./interfaces/answer";

@Injectable({
  providedIn: "root",
})
export class BackendService {
  private backendUrl: string = environment.backendUrl;
  private changeViewEventSource = new Subject<string>();
  changeViewEvent$: Observable<
    string
  > = this.changeViewEventSource.asObservable();
  private source: EventSource;

  constructor(private http: HttpClient, private dataService: DataService) {}

  // Control

  connectToChangeNotifications(): void {
    const quizId: string = this.dataService.getQuizId();
    if (!this.source) {
      this.source = new EventSource(
        `${this.backendUrl}/stream?channel=${quizId}`
      );
      this.source.addEventListener("message", (resp) => {
        const data = JSON.parse(resp["data"]);
        const quizCurrentPage = data["current_page"];
        this.changeViewEventSource.next(quizCurrentPage);
      });
    }
  }

  // Quiz

  createQuiz(quizName: string): Observable<Quiz> {
    const body = {
      name: quizName,
    };
    return this.http.post<Quiz>(`${this.backendUrl}/quiz`, body);
  }

  getQuiz(): Observable<Quiz> {
    const quizId: string = this.dataService.getQuizId();
    return this.http.get<Quiz>(`${this.backendUrl}/quiz/${quizId}`);
  }

  setNumRounds(numRounds: number): Observable<Quiz> {
    const quizId: string = this.dataService.getQuizId();
    const body = {
      number_rounds: numRounds,
    };
    return this.http.put<Quiz>(`${this.backendUrl}/quiz/${quizId}`, body);
  }

  updateQuiz(currentPage: string, currentRound: number): Observable<Quiz> {
    const body = { current_page: currentPage };
    if (currentRound !== null) {
      body["current_round"] = currentRound;
    }
    const quizId: string = this.dataService.getQuizId();
    return this.http.put<Quiz>(`${this.backendUrl}/quiz/${quizId}`, body);
  }

  // Questions

  addQuestions(questions: Array<object>): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    const body = {
      questions: questions,
    };
    return this.http.post(`${this.backendUrl}/questions/${quizId}`, body);
  }

  getAllQuestions(): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    return this.http.get(`${this.backendUrl}/questions/${quizId}`);
  }

  getRoundQuestions(roundNum: number): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    return this.http.get(`${this.backendUrl}/questions/${quizId}/${roundNum}`);
  }

  getQuizAndRoundQuestions(): Observable<object> {
    return this.getQuiz().pipe(
      switchMap((quiz) => {
        const roundNum = quiz.current_round;
        return this.getRoundQuestions(roundNum).pipe(
          map((resp2) => {
            return { quiz: quiz, questions: resp2 };
          })
        );
      })
    );
  }

  addRounds(
    questions: Array<object>,
    numRounds: number
  ): Observable<[object, object]> {
    return forkJoin(this.addQuestions(questions), this.setNumRounds(numRounds));
  }

  // Participants

  addParticipant(participantName: string): Observable<Participant> {
    const quizId: string = this.dataService.getQuizId();
    const body = {
      quiz_id: quizId,
      name: participantName,
    };
    return this.http.post<Participant>(`${this.backendUrl}/participant`, body);
  }

  deleteParticipant(participant: Participant) {
    const id = participant.id;
    return this.http.delete(`${this.backendUrl}/participant/${id}`);
  }

  getParticipants(): Observable<ParticipantsResponse> {
    const quizId: string = this.dataService.getQuizId();
    return this.http.get<ParticipantsResponse>(
      `${this.backendUrl}/participants/${quizId}`
    );
  }

  setParticipantScores(participants: Array<Participant>): Observable<Quiz> {
    const quizId: string = this.dataService.getQuizId();
    const body = {
      participants: participants,
    };
    return this.http
      .put(`${this.backendUrl}/participants/${quizId}`, body)
      .pipe(
        switchMap(() => {
          return this.updateQuiz("leaderboard", null);
        })
      );
  }

  // Answers

  submitAnswers(answers: Array<Answer>): Observable<object> {
    const body = {
      answers: answers,
    };
    return this.http.post(`${this.backendUrl}/answers`, body);
  }

  getAnswers(
    participantId: number,
    roundNum: number
  ): Observable<AnswersResponse> {
    const quizId: string = this.dataService.getQuizId();
    return this.http.get<AnswersResponse>(
      `${this.backendUrl}/answers/${quizId}/${roundNum}/${participantId}`
    );
  }
}
