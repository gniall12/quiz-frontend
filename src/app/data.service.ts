import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor() {}

  public getQuizId(): string {
    return localStorage.getItem("quizId");
  }

  public setQuizId(quizId: string) {
    localStorage.setItem("quizId", quizId);
  }

  public getParticipantId(): string {
    return localStorage.getItem("participantId");
  }

  public setParticipantId(participantId: string) {
    localStorage["participantId"] = participantId;
  }
}
