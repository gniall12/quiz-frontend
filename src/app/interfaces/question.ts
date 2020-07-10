export interface Question {
  id: number;
  quiz_id: number;
  round_number: number;
  question: string;
}

export interface QuestionsResponse {
  questions: Array<Question>;
}
