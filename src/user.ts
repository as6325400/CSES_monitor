import { getUserName, getAcceptedNum, getAcceptSet, getUserExist } from "./webcrawler";
import fs from "fs";


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
  }

  static async createUser(id: string): Promise<User | string> {

    if(await getUserExist(id) === null) return "The user not exist!";

    for (const user of User.userSet) {
      if (user.Id === id) return "The user already exist!";
    }
    
    const name : string = await getUserName(id);
    const acceptProblem : Set<string> = await getAcceptSet(id);
    const accept : number= acceptProblem.size;

    const user = new User(name, id, accept, acceptProblem);
    User.userSet.add(user);
    User.saveUser();

    return user;
  }

  static async saveUser() : Promise<void> {

    const nowUserId : string[]= [];

    for (const user of User.userSet) {
      nowUserId.push(user.Id);
    }

    const obj = {
      "USERID_SET": nowUserId
    };

    const data = JSON.stringify(obj, null, 2);
    fs.writeFileSync("./file/User.json", data);
  }
  // this method is used to load all the users from the file
  // you need to check if the user exists in the file
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

  
  public updateAccept(newAcceptProblem: Set<string>): void {
    for (const problem of newAcceptProblem) {
      this.AcceptProblem.add(problem);
    }
    this.Accept = this.AcceptProblem.size;
  }



  public static getUserSet() : Set<User> {
    return User.userSet;
  }
}

