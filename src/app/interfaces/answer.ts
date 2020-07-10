import { Question } from "./question";

export interface Answer {
  id: number;
  question_id: number;
  participant_id: number;
  answer: string;
  question: Question;
  correct: boolean;
}

export interface AnswersResponse {
  answers: Array<Answer>;
}
