import { Message } from "discord.js";
import { Query } from "./query";
import { User } from "./user";
import { getUserExist } from "./webcrawler";

function isNumber(input: string): boolean {
  const regex = /^[0-9]+$/; 
  return regex.test(input);
}

export async function handleMessage(message: Message, query: Query, ) {
  const command : string[] = message.content.split(" ");
  if (message.author.bot || command[0] != process.env.BOT_PREFIX!) return;
  if (command.length < 2) return;
  if (command[1] === "tagsets") {

    let mes : string = "";
    let idx = 1;

    for(const key of query.getTagSets()) {
      console.log(key);
      mes += `${idx}. ${key}\n`;
      idx++;
    }
    
    message?.reply(mes);
  }

  else if (command[1] == "add"){
    if (command.length < 3) {
      message?.reply("Please input the user id!");
      return;
    }

    if(command.length > 3) {
      message?.reply("Please input the correct user id!");
      return;
    }

    if(command[2].length > 7){
      message?.reply("Please input the correct user id!");
      return;
    }

    if(isNumber(command[2]) === false) {
      message?.reply("Please input the correct user id!");
      return;
    }

    if (getUserExist(command[2]) === null) {
      message?.reply("User does not exist!");
      return;
    }

    command[2] = parseInt(command[2]).toString();

    const newUser: User | string = await User.createUser(command[2]);

    if (typeof newUser === "string") {
      message?.reply(newUser);
    }
    else if (typeof newUser === "object"){
      console.log(newUser);
      message?.reply(`User ${newUser.Name} add success!`);
    }
    else if (newUser === undefined) {
      message?.reply("User does not exist!");
    }
  }

  else if (command[1] == "show"){
    if (command.length < 3) {
      message?.reply("Please input the user name!");
      return;
    }

    if(command[2] === "all") {
      let mes : string = "";
      for (const user of User.getUserSet()) {
        mes += `User [${user.Name}](https://cses.fi/problemset/user/${user.Id}/) has \`${user.Accept}\` accepted problems\n`;
      }

      if(mes === "") {
        message?.reply("No user in databases!");
      }
      message?.reply(mes);
      return;
    }

    for (const user of User.getUserSet()) {
      if (user.Name === command[2]) {
        message?.reply(`User [${user.Name}](https://cses.fi/problemset/user/${user.Id}/) has \`${user.Accept}\` accepted problems`);
        return;
      }
    }
    message?.reply("User does not in databases!");
  }
}