import { getProblemSet } from "./webcrawler";
import { Problem, ProblemSetMap } from "./problem";

export class Query {
  private problemSet: ProblemSetMap;
  private tagSets: Set<string> = new Set<string>();

  private constructor(problemSet: ProblemSetMap) {
    this.problemSet = problemSet;
    for (const key in problemSet) {
      const tags = problemSet[key].tags;
      this.tagSets.add(tags);
    }
  }

  static async init(): Promise<Query> {
    const problemSet: ProblemSetMap = await getProblemSet(); 
    return new Query(problemSet);
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

  public getTagSets(): Set<string> {
    return this.tagSets;
  }
}