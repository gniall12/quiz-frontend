import { Answer } from "./answer";

export interface Participant {
  id: number;
  quiz_id: number;
  name: string;
  score: number;
  selected: boolean;
  answers: Array<Answer>;
}
