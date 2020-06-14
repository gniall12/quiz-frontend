import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { switchMap, map } from "rxjs/operators";
import { Subject, forkJoin, concat, Observable } from "rxjs";
import { DataService } from "./data.service";
import { environment } from "./../environments/environment";

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
      console.log("CONNECT");
      this.source = new EventSource(
        `${this.backendUrl}/stream?channel=${quizId}`
      );
      this.source.addEventListener("message", () => {
        this.changeViewEventSource.next("Change");
      });
    }
  }

  changePage(): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    return this.http.get(`${this.backendUrl}/change/${quizId}`);
  }

  // Quiz

  createQuiz(quizName: string): Observable<object> {
    const body = {
      name: quizName,
    };
    return this.http.post(`${this.backendUrl}/quiz`, body);
  }

  getQuiz(): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    return this.http.get(`${this.backendUrl}/quiz/${quizId}`);
  }

  setNumRounds(numRounds: number): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    const body = {
      number_rounds: numRounds,
    };
    return this.http.put(`${this.backendUrl}/quiz/${quizId}`, body);
  }

  changeRoundAndProceed(roundNum: number): Observable<object> {
    return concat(this.updateRoundNumber(roundNum), this.changePage());
  }

  updateRoundNumber(roundNum: number): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    const body = {
      current_round: roundNum,
    };
    return this.http.put(`${this.backendUrl}/quiz/${quizId}`, body);
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
      switchMap((resp) => {
        const roundNum = resp["current_round"];
        return this.getRoundQuestions(roundNum).pipe(
          map((resp2) => {
            return { quiz: resp, questions: resp2 };
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

  addParticipant(participantName: string): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    const body = {
      quiz_id: quizId,
      name: participantName,
    };
    return this.http.post(`${this.backendUrl}/participant`, body);
  }

  deleteParticipant(participant: object) {
    const id = participant["id"];
    return this.http.delete(`${this.backendUrl}/participant/${id}`);
  }

  getParticipants(): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    return this.http.get(`${this.backendUrl}/participants/${quizId}`);
  }

  setParticipantScores(participants: Array<object>): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    const body = {
      participants: participants,
    };
    return this.http
      .put(`${this.backendUrl}/participants/${quizId}`, body)
      .pipe(
        switchMap((resp) => {
          return this.changePage();
        })
      );
  }

  // Answers

  submitAnswers(questions: Array<object>): Observable<object> {
    const participantId = this.dataService.getParticipantId();
    questions.forEach((question) => {
      question["question_id"] = question["id"];
      question["participant_id"] = participantId;
    });
    const body = {
      answers: questions,
    };
    console.log(body);
    return this.http.post(`${this.backendUrl}/answers`, body);
  }

  getAnswers(participantId: string, roundNum: number): Observable<object> {
    const quizId: string = this.dataService.getQuizId();
    return this.http.get(
      `${this.backendUrl}/answers/${quizId}/${roundNum}/${participantId}`
    );
  }
}
