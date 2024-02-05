import { getUserName, getAcceptedNum, getAcceptSet } from "./webcrawler";


export class User{

  Name: string;
  Id: string;
  Accept: number;
  AcceptProblem: Set<string>;
  static userSet : Set<User> = new Set<User>();

  private constructor(name: string, id: string, accept: number, acceptProblem: Set<string>) {
    this.Name = name;
    this.Id = id;
    this.Accept = accept;
    this.AcceptProblem = acceptProblem;
    User.userSet.add(this);
  }

  static async createUser(id: string): Promise<void> {
    
    const name : string = await getUserName(id);
    const accept : number= await getAcceptedNum(id);
    const acceptProblem : Set<string> = await getAcceptSet(id);
    
    new User(name, id, accept, acceptProblem);
  }

  static async loadUser(idSets : string []) : Promise<void> {
    
    for (const id of idSets) {
      await User.createUser(id);
    }
    
  }

  public diffSets (newSet: Set<string>): Set<string> {
    const diff = new Set<string>();
    for (const item of newSet) if (!this.AcceptProblem.has(item)) diff.add(item);
    for (const item of this.AcceptProblem) if (!newSet.has(item)) diff.add(item);
    return diff;
  }

  public equalSets (newSet : Set<string>): boolean {
    return this.diffSets(newSet).size === 0;
  }
  
  public updateAccept(newAcceptProblem: Set<string>): void {
    for (const problem of newAcceptProblem) {
      this.AcceptProblem.add(problem);
    }
  }



  public static getUserSet() : Set<User> {
    return User.userSet;
  }
}

