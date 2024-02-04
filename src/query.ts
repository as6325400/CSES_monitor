import { getProblemSet } from "./webcrawler";
import { Problem, ProblemSetMap } from "./problem";

export class Query {
  private problemSet: ProblemSetMap;

  private constructor(Set : ProblemSetMap) {
    this.problemSet = Set;
  }

  static async init() : Promise<Query> {
    const Set : ProblemSetMap =  await getProblemSet();
    return new Query(Set);
  }

  public getProblemSet(): ProblemSetMap {
    return this.problemSet;
  }

  public getProblem(name: string): Problem | null{
    if (!this.problemSet) {
      return null;
    }

    for (const key in this.problemSet) {
      if (key === name) {
        return this.problemSet[key];
      }
    }
    return null;
  }
}