import { getUserName, getAcceptedNum, getAcceptSet } from "./webcrawler";


export class User{

  Name: string;
  Id: string;
  Accept: number;
  AcceptProblem: Set<string>;

  private constructor(name: string, id: string, accept: number, acceptProblem: Set<string>) {
    this.Name = name;
    this.Id = id;
    this.Accept = accept;
    this.AcceptProblem = acceptProblem;
  }

  static async createUser(id: string): Promise<User> {
    
    const name : string = await getUserName(id);
    const accept : number= await getAcceptedNum(id);
    const acceptProblem : Set<string> = await getAcceptSet(id);
    
    return new User(name, id, accept, acceptProblem);
  }

  static async loadUser(idSets : string []) : Promise<User[]> {
    const users : User[] = [];
    for (const id of idSets) {
      users.push(await User.createUser(id));
    }
    return users;
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
}

