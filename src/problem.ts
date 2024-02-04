export interface Problem {
  id: string;
  title: string;
  tags: string;
  url: string;
}

export interface ProblemSet {
  tags: string;
  problems: Problem[];
}

export interface ProblemSetMap {
  [key: string]: ProblemSet;
}
