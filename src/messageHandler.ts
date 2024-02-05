import { Message } from "discord.js";
import { Query } from "./query";
import { User } from "./user";
import { getUserExist } from "./webcrawler";

export async function handleMessage(message: Message, query: Query, ) {
  if (message.author.bot || !message.content.startsWith(process.env.BOT_PREFIX!)) return;
  const command : string[] = message.content.split(" ");
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

    if (getUserExist(command[2]) === null) {
      message?.reply("User does not exist!");
      return;
    }

    const newUser: User | string = await User.createUser(command[2]);

    if (typeof newUser === "string") {
      message?.reply(newUser);
    }
    else {
      message?.reply(`User ${newUser.Name} has been added!`);
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
        mes += `User ${user.Name} has ${user.Accept} accepted problems!\n`;
      }
      message?.reply(mes);
      return;
    }

    for (const user of User.getUserSet()) {
      if (user.Name === command[2]) {
        message?.reply(`User ${user.Name} has ${user.Accept} accepted problems!`);
        return;
      }
    }
    message?.reply("User does not in database!");
  }
}