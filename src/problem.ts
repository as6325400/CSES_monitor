export interface Problem {
  id: string;
  title: string;
  tags: string;
  url: string;
}


export interface ProblemSetMap {
  [key: string]: Problem;
}
